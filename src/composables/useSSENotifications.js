/**
 * composables/useSSENotifications.js
 * 
 * Vue composable for managing Server-Sent Events connection
 * Handles real-time project invitation notifications
 */

import { ref, onUnmounted } from 'vue';
import { useLoggedInUserStore } from '@/stored/loggedInUser';
import { toast } from 'vue3-toastify';

export function useSSENotifications() {
  const eventSource = ref(null);
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 3;
  
  const loggedInUserStore = useLoggedInUserStore();
  
  /**
   * Establish SSE connection to the backend
   */
  function connect() {
    // Only connect for logged-in students
    if (!loggedInUserStore.isLoggedIn || loggedInUserStore.getRole !== 'Student') {
      return;
    }
    
    // Close existing connection if any
    disconnect();
    
    const token = loggedInUserStore.token;
    const apiURL = import.meta.env.VITE_ROOT_API;
    
    try {
      
      // Create EventSource with token in query parameter
      eventSource.value = new EventSource(
        `${apiURL}/studentSideData/notifications/stream?token=${encodeURIComponent(token)}`
      );
      
      // Connection opened successfully
      eventSource.value.onopen = () => {
        isConnected.value = true;
        reconnectAttempts.value = 0;
      };
      
      // Handle incoming messages
      eventSource.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleNotification(data);
        } catch (err) {
          console.error('SSE: Error parsing message', err);
        }
      };
      
      // Handle connection errors
      eventSource.value.onerror = (error) => {
        console.error('SSE: Connection error', error);
        isConnected.value = false;
        
        // EventSource will auto-reconnect, but we'll limit attempts
        reconnectAttempts.value++;
        
        if (reconnectAttempts.value >= maxReconnectAttempts) {
          disconnect();
        }
      };
      
    } catch (err) {
      console.error('SSE: Failed to create EventSource', err);
    }
  }
  
/**
 * Handle incoming notification
 * @param {Object} data - Notification data from server
 */
function handleNotification(data) {
 
  switch (data.type) {
    case 'connected':
      // Connection confirmation - no action needed
      break;
     
    case 'projectInvitation':
      // Increment invitation count in store
      loggedInUserStore.projectInvitationCount++;
     
      // Show toast notification
      toast.info(`You've been invited to join "${data.projectName}"!`, {
        position: 'top-right',
        toastClassName: 'Toastify__toast--update',
        autoClose: 5000,
        onClick: () => {
          // Optional: Navigate to projects page when toast is clicked
          window.location.href = '#/projects';
        }
      });
     
      break;
     
    case 'invitationRetracted':
      // Decrement invitation count in store
      loggedInUserStore.decrementInvitationCount();
     
      // Show notification about retraction
      const retractedByText = data.retractedBy ? ` by ${data.retractedBy}` : '';
      toast.warning(
        `Your invitation to "${data.projectName}" has been retracted${retractedByText}.`,
        {
          position: 'top-right',
          toastClassName: 'Toastify__toast--warning',
          autoClose: 7000
        }
      );
     
      break;
     
    default:
      console.log('SSE: Unknown notification type', data.type);
  }
}
  
  /**
   * Close SSE connection
   */
  function disconnect() {
    if (eventSource.value) {
      eventSource.value.close();
      eventSource.value = null;
      isConnected.value = false;
    }
  }
  
  // Clean up on component unmount
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    connect,
    disconnect,
    isConnected,
    reconnectAttempts
  };
}