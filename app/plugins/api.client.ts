import { defineNuxtPlugin } from "#imports";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
  });

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
        } catch  {}
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
