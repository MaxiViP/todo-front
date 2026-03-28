<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <UCard class="w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Вход в ToDo App</h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <UFormField label="Email" required>
          <UInput v-model="email" type="email" placeholder="admin@test.com" size="lg" />
        </UFormField>

        <UFormField label="Пароль" required>
          <UInput v-model="password" type="password" placeholder="••••••••" size="lg" />
        </UFormField>

        <UButton type="submit" color="success" size="lg" class="w-full" :loading="loading">
          Войти
        </UButton>
      </form>

      <div class="text-center text-sm text-gray-500 mt-6">
        Нет аккаунта?
        <NuxtLink to="/register" class="text-green-600 hover:underline">
          Зарегистрироваться
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)

const auth = useAuthStore()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Введите email и пароль')
    return
  }

  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch (err: any) {
    alert(err.response?.data?.message || 'Неверный email или пароль')
  } finally {
    loading.value = false
  }
}
</script>
