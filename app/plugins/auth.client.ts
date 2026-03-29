// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();

  if (process.client) {
    await auth.init();
  }
});
