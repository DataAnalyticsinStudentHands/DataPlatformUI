/**
 * composables/useNotificationPolling.js
 *
 * Polls the notification-count endpoint to detect new project invitations.
 * Replaces the removed SSE-based notification system.
 */

import { ref, onUnmounted } from 'vue';
import { useLoggedInUserStore } from '@/stored/loggedInUser';
import { toast } from 'vue3-toastify';

const POLL_INTERVAL_MS = 20000; // 20 seconds

export function useNotificationPolling() {
  let pollingTimer = null;
  let previousCount = null;
  const isPolling = ref(false);

  const store = useLoggedInUserStore();

  async function poll() {
    try {
      await store.fetchProjectInvitationCount();
      const currentCount = store.projectInvitationCount;

      // Show toast when invitation count increases (skip initial fetch)
      if (previousCount !== null && currentCount > previousCount) {
        const newInvitations = currentCount - previousCount;
        toast.info(
          newInvitations === 1
            ? "You have a new project invitation!"
            : `You have ${newInvitations} new project invitation(s)!`,
          {
            position: 'top-right',
            toastClassName: 'Toastify__toast--update',
            autoClose: 5000,
            onClick: () => {
              window.location.href = '#/projects';
            }
          }
        );
      }

      previousCount = currentCount;
    } catch (err) {
      // 401 = token expired or invalid, stop polling
      if (err.response?.status === 401) {
        stopPolling();
      }
    }
  }

  function startPolling() {
    if (!store.isLoggedIn || store.getRole !== 'Student') {
      return;
    }

    stopPolling();
    previousCount = store.projectInvitationCount;
    isPolling.value = true;

    // Poll immediately, then on interval
    poll();
    pollingTimer = setInterval(poll, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    isPolling.value = false;
    previousCount = null;
  }

  onUnmounted(() => {
    stopPolling();
  });

  return {
    startPolling,
    stopPolling,
    isPolling
  };
}
