// initAuth.client.ts;
export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  auth.init();
});
