// stores/auth.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);

  // 🔁 REFRESH (через axios)
  const restoreSession = async (): Promise<boolean> => {
    if (!process.client) return false;

    try {
      const { $api } = useNuxtApp();

      const res = await $api.post("/auth/refresh");

      token.value = res.data.token;
      user.value = res.data.user;

      return true;
    } catch (err) {
      console.error("Restore session failed:", err);
      token.value = null;
      user.value = null;
      return false;
    }
  };

  // 🚀 INIT
  const init = async () => {
    await restoreSession();
  };

  // 🔐 LOGIN
  const login = async (email: string, password: string, rememberMe = false) => {
    const { $api } = useNuxtApp();

    try {
      const res = await $api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      token.value = res.data.token;
      user.value = res.data.user;

      await navigateTo("/");
    } catch (err: any) {
      throw err;
    }
  };

  // 🔳 QR LOGIN
  const loginWithToken = async (newToken: string, newUser?: any) => {
    token.value = newToken;
    if (newUser) user.value = newUser;

    await navigateTo("/");
  };

  // 🚪 LOGOUT
  const logout = async () => {
    const { $api } = useNuxtApp();

    try {
      await $api.post("/auth/logout");
    } catch (e) {
      // игнор
    }

    token.value = null;
    user.value = null;

    await navigateTo("/login", { replace: true });
  };

  return {
    token,
    user,
    isAuthenticated,
    init,
    login,
    loginWithToken,
    logout,
    restoreSession,
  };
});
