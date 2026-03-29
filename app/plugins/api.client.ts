// plugins/api.client.ts
import axios from "axios";

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true, // 🔥 обязательно для cookie
  });

  const authStore = useAuthStore();

  // 👉 Добавляем access token
  api.interceptors.request.use((config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      // 🔥 Не пытаемся обновить токен, если это сам запрос refresh
      const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isRefreshRequest
      ) {
        originalRequest._retry = true;
        try {
          const refreshed = await authStore.restoreSession();
          if (refreshed && authStore.token) {
            originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
            return api(originalRequest);
          }
        } catch (e) {
          console.error("Refresh failed", e);
        }
        await authStore.logout();
      }
      return Promise.reject(error);
    },
  );

  return {
    provide: {
      api,
    },
  };
});
