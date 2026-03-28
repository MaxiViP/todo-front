// stores/auth.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);

  const init = () => {
    if (process.client) {
      // <- проверка клиента
      const savedToken = localStorage.getItem("token");
      if (savedToken) token.value = savedToken;
    }
  };

  const login = async (email: string, password: string) => {
    const { $api } = useNuxtApp();
    const { data } = await $api.post("/auth/login", { email, password });

    token.value = data.token;
    if (data.user) user.value = data.user;

    if (process.client) localStorage.setItem("token", data.token);

    await navigateTo("/");
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    if (process.client) localStorage.removeItem("token");
    navigateTo("/login", { replace: true });
  };

  return { token, user, isAuthenticated, init, login, logout };
});
