import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useNuxtApp, navigateTo } from "#imports";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);

  const restoreSession = async (): Promise<boolean> => {
    if (!process.client) return false;

    try {
      const { $api } = useNuxtApp();

      const res = await $api.post("/auth/refresh");

      token.value = res.data.token;
      user.value = res.data.user;

      return true;
    } catch (err) {
      token.value = null;
      user.value = null;
      return false;
    }
  };

  const init = async () => {
    await restoreSession();
  };

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

  const loginWithToken = async (newToken: string, newUser?: any) => {
    token.value = newToken;
    if (newUser) user.value = newUser;

    await navigateTo("/");
  };

  const logout = async () => {
    const { $api } = useNuxtApp();

    try {
      await $api.post("/auth/logout");
    } catch (e) {
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
