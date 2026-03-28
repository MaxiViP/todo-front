<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- HEADER -->
    <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-lg font-semibold">ToDo App</h1>

      <div v-if="auth.token">
        <button
          @click="logout"
          class="text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Выйти
        </button>
      </div>
    </header>

    <!-- GLOBAL LOADER -->
    <div v-if="loading" class="h-1 bg-blue-500 animate-pulse"></div>

    <!-- PAGE -->
    <main class="p-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const loading = ref(false)

// 🔐 init auth (если вдруг plugin не сработал)
onMounted(() => {
  auth.init()
})

// 🚀 loader при навигации
const router = useRouter()

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  loading.value = false
})

// logout
const logout = () => {
  auth.logout()
}
</script>
