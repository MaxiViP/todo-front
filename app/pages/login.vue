<template>
  <div class="flex items-center justify-center h-screen">
    <div class="w-96 p-6 bg-white shadow rounded-xl">
      <h2 class="text-xl mb-4">Login</h2>

      <input v-model="email" placeholder="Email" class="input" />
      <input v-model="password" type="password" placeholder="Password" class="input mt-2" />

      <button @click="handleLogin" class="btn mt-4 w-full">
        Login
      </button>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const auth = useAuthStore()

const handleLogin = () => {
  auth.login(email.value, password.value)
}
</script>

<style>
.input {
  @apply w-full border p-2 rounded;
}
.btn {
  @apply bg-blue-500 text-white p-2 rounded;
}
</style>
