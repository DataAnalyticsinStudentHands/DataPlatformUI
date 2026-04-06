/**
 * src/composables/useAdaptiveLayout.js
 *
 * Observes two column elements and determines if lower-priority sections
 * should overflow below the grid when the poster column is significantly
 * taller than the info column.
 *
 * Uses ResizeObserver with debouncing and hysteresis to prevent layout thrashing.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

/**
 * @param {Object} options
 * @param {import('vue').Ref<boolean>} options.enabled - Whether to observe (e.g. only when poster exists)
 * @param {number} [options.threshold=300] - px delta to trigger overflow
 * @param {string[]} [options.overflowOrder=['impact', 'partners']] - sections to move, in priority order
 */
export function useAdaptiveLayout(options = {}) {
  const {
    enabled = ref(true),
    threshold = 300,
    overflowOrder = ['impact', 'partners'],
  } = options;

  const infoColumnRef = ref(null);
  const posterColumnRef = ref(null);
  const overflowSections = ref(new Set());
  const isOverflowing = computed(() => overflowSections.value.size > 0);

  let observer = null;
  let debounceTimer = null;
  let stabilizing = false;

  /**
   * Get the actual content height of a flex/grid column by summing children heights + gaps.
   * This avoids the CSS Grid stretch issue where scrollHeight matches the tallest row.
   */
  function getContentHeight(el) {
    const children = el.children;
    if (!children.length) return 0;

    const style = getComputedStyle(el);
    const gap = parseFloat(style.rowGap) || parseFloat(style.gap) || 0;

    let totalHeight = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      // Skip hidden elements
      if (child.offsetParent === null && getComputedStyle(child).position !== 'fixed') continue;
      totalHeight += child.getBoundingClientRect().height;
    }

    // Add gaps between visible children
    const visibleCount = Array.from(children).filter(
      c => c.offsetParent !== null || getComputedStyle(c).position === 'fixed'
    ).length;
    if (visibleCount > 1) {
      totalHeight += gap * (visibleCount - 1);
    }

    return totalHeight;
  }

  function isStackedLayout() {
    const infoEl = infoColumnRef.value;
    const posterEl = posterColumnRef.value;
    if (!infoEl || !posterEl) {
      console.log('[AdaptiveLayout] isStackedLayout: missing refs', { infoEl: !!infoEl, posterEl: !!posterEl });
      return true;
    }

    const infoRect = infoEl.getBoundingClientRect();
    const posterRect = posterEl.getBoundingClientRect();
    const stacked = Math.abs(infoRect.left - posterRect.left) < 50;

    console.log('[AdaptiveLayout] isStackedLayout:', stacked, {
      infoLeft: infoRect.left,
      posterLeft: posterRect.left,
      diff: Math.abs(infoRect.left - posterRect.left),
    });

    return stacked;
  }

  function evaluate() {
    console.log('[AdaptiveLayout] evaluate() called', { stabilizing, enabled: enabled.value });
    if (stabilizing) return;

    const infoEl = infoColumnRef.value;
    const posterEl = posterColumnRef.value;
    if (!infoEl || !posterEl) {
      console.log('[AdaptiveLayout] evaluate: missing refs', { infoEl: !!infoEl, posterEl: !!posterEl });
      return;
    }

    // Don't overflow in stacked (mobile/tablet) layout
    if (isStackedLayout()) {
      if (overflowSections.value.size > 0) {
        overflowSections.value = new Set();
      }
      return;
    }

    // Measure actual content height (not grid-stretched height).
    const infoHeight = getContentHeight(infoEl);
    const posterHeight = getContentHeight(posterEl);
    // Only overflow when sidebar is taller than poster — that's the empty-space scenario.
    // When poster is taller, the sidebar is fine as-is.
    const delta = infoHeight - posterHeight;

    console.log('[AdaptiveLayout] heights:', {
      infoHeight,
      posterHeight,
      delta,
      threshold,
      currentOverflow: [...overflowSections.value],
    });

    if (delta > threshold && overflowSections.value.size < overflowOrder.length) {
      // Sidebar is much taller than poster → move next card to poster column
      const nextSection = overflowOrder.find(s => !overflowSections.value.has(s));
      if (nextSection) {
        console.log('[AdaptiveLayout] → OVERFLOW triggered, moving section:', nextSection);
        overflowSections.value = new Set([...overflowSections.value, nextSection]);
        stabilize();
      }
    } else {
      console.log('[AdaptiveLayout] → No change needed');
    }
  }

  function stabilize() {
    stabilizing = true;
    nextTick(() => {
      // Wait one more frame for layout to settle
      requestAnimationFrame(() => {
        stabilizing = false;
      });
    });
  }

  function debouncedEvaluate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(evaluate, 100);
  }

  function startObserving() {
    stopObserving();

    const infoEl = infoColumnRef.value;
    const posterEl = posterColumnRef.value;
    console.log('[AdaptiveLayout] startObserving:', { infoEl: !!infoEl, posterEl: !!posterEl });
    if (!infoEl || !posterEl) return;

    observer = new ResizeObserver(debouncedEvaluate);
    observer.observe(infoEl);
    observer.observe(posterEl);
    console.log('[AdaptiveLayout] ResizeObserver attached, running initial evaluate');

    // Initial evaluation
    evaluate();
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    clearTimeout(debounceTimer);
  }

  // Watch for enabled changes and ref availability
  watch(
    [enabled, infoColumnRef, posterColumnRef],
    ([isEnabled]) => {
      console.log('[AdaptiveLayout] watch triggered:', {
        isEnabled,
        hasInfoRef: !!infoColumnRef.value,
        hasPosterRef: !!posterColumnRef.value,
      });
      if (isEnabled && infoColumnRef.value && posterColumnRef.value) {
        nextTick(startObserving);
      } else {
        stopObserving();
        if (!isEnabled && overflowSections.value.size > 0) {
          overflowSections.value = new Set();
        }
      }
    },
    { immediate: false }
  );

  onMounted(() => {
    console.log('[AdaptiveLayout] onMounted:', {
      enabled: enabled.value,
      hasInfoRef: !!infoColumnRef.value,
      hasPosterRef: !!posterColumnRef.value,
    });
    if (enabled.value && infoColumnRef.value && posterColumnRef.value) {
      nextTick(() => {
        requestAnimationFrame(startObserving);
      });
    }
  });

  onBeforeUnmount(() => {
    stopObserving();
  });

  return {
    infoColumnRef,
    posterColumnRef,
    overflowSections,
    isOverflowing,
  };
}
