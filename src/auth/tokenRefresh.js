/**
 * src/auth/tokenRefresh.js
 *
 * Axios interceptors for HttpOnly cookie auth. A request interceptor
 * proactively refreshes the session cookie before it expires (using
 * the persisted tokenExp from the Pinia store). A response interceptor
 * retries once on 401 as a safety net.
 */

import axios from 'axios';

const apiURL = import.meta.env.VITE_ROOT_API;
let refreshPromise = null;

/**
 * Refresh the session cookie. Concurrent calls share the same
 * in-flight request via the singleton promise pattern.
 */
function refreshToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post(`${apiURL}/userData/refresh-token`, {}, { _skipRefreshCheck: true })
    .then(async (res) => {
      const { useLoggedInUserStore } = await import('@/stored/loggedInUser');
      const store = useLoggedInUserStore();
      store.tokenExp = res.data.expiresAt;
      store.setAutoLogout(res.data.expiresAt);
    })
    .catch(async (err) => {
      if (err.response?.status === 401) {
        const { useLoggedInUserStore } = await import('@/stored/loggedInUser');
        const store = useLoggedInUserStore();
        if (store.isLoggedIn) {
          store.logout();
        }
      }
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/**
 * Register axios interceptors:
 * - Request: proactive refresh 5 min before tokenExp
 * - Response: retry once on 401 after a refresh attempt
 */
export function setupTokenRefreshInterceptor() {
  // Proactive refresh before expiry
  axios.interceptors.request.use(async (config) => {
    if (config._skipRefreshCheck) return config;

    const { useLoggedInUserStore } = await import('@/stored/loggedInUser');
    const store = useLoggedInUserStore();

    if (!store.isLoggedIn || !store.tokenExp) return config;

    const now = Math.floor(Date.now() / 1000);
    if (store.tokenExp - now < 300) {
      try {
        await refreshToken();
      } catch {
        // refresh failed — let the request proceed, 401 interceptor will handle it
      }
    }

    return config;
  });

  // Safety net: on 401, try refresh once then retry the original request
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._skipRefreshCheck &&
        !originalRequest._retried
      ) {
        originalRequest._retried = true;
        try {
          await refreshToken();
          return axios(originalRequest);
        } catch {
          // refresh failed — logout already handled in refreshToken catch
        }
      }

      return Promise.reject(error);
    }
  );
}
