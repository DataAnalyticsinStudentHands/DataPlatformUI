/**
 * src/components/studentSide/projectView/components/FooterBanner.vue
 *
 * Footer information banner with configurable variant styling.
 * Supports 'info' (yellow), 'notice' (blue), and 'success' (green) variants.
 * Used in both Research and Development templates.
 */

<template>
  <section class="footer-banner" :class="variantClass">
    <div class="icon">{{ icon }}</div>
    <p>{{ message }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'ℹ️',
  },
  message: {
    type: String,
    required: true,
    default: 'This project page is publicly viewable via a secure link.',
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'notice', 'success', 'warning'].includes(value),
  },
});

const variantClass = computed(() => `variant-${props.variant}`);
</script>

<style scoped>
.footer-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 12px;
}

.footer-banner .icon {
  font-size: 14px;
  flex-shrink: 0;
}

.footer-banner p {
  margin: 0;
  line-height: 1.3;
}

/* Variant: Info (Yellow/Amber) */
.footer-banner.variant-info {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

/* Variant: Notice (Blue) */
.footer-banner.variant-notice {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

/* Variant: Success (Green) */
.footer-banner.variant-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

/* Variant: Warning (Orange/Red) */
.footer-banner.variant-warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}
</style>