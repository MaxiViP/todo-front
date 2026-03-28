// auth.client.ts;
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
