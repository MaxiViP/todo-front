<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased"
  >
    <UHeader>
      <template #left>
        <h1 class="text-2xl font-semibold tracking-tight">ToDo App</h1>
      </template>
      <template #right>
        <UButton
          v-if="auth.isAuthenticated"
          color="red"
          variant="ghost"
          @click="logout"
        >
          Выйти
        </UButton>
      </template>
    </UHeader>

    <NuxtLoadingIndicator color="#00C16A" />

    <main class="p-6 max-w-5xl mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();

const logout = () => auth.logout();
</script>
