import axios from "axios";

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: "http://localhost:3001/api",
  });

  api.interceptors.request.use((config) => {
    if (process.client) {
      // только на клиенте
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 && process.client) {
        localStorage.removeItem("token");
        navigateTo("/login");
      }
      return Promise.reject(err);
    },
  );

  return { provide: { api } };
});
