<!-- pages/register.vue -->
<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"
  >
    <UCard class="w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Регистрация</h2>

      <form class="space-y-5" @submit.prevent="handleRegister">
        <UFormGroup label="Email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Пароль" required>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Минимум 6 символов"
            size="lg"
          />
        </UFormGroup>

        <div class="flex items-center gap-2">
          <UCheckbox
            v-model="wantAdmin"
            label="Зарегистрироваться как администратор"
          />
        </div>

        <UFormGroup
          v-if="wantAdmin"
          label="Секретный код администратора"
          required
        >
          <UInput v-model="form.adminCode" placeholder="ADMIN123" size="lg" />
          <p class="text-xs text-gray-500 mt-1">
            Тестовый код:
            <span class="font-mono bg-gray-100 px-1 rounded">ADMIN123</span>
          </p>
        </UFormGroup>

        <UButton
          type="submit"
          color="success"
          size="lg"
          class="w-full"
          :loading="loading"
        >
          Создать аккаунт
        </UButton>
      </form>

      <div class="text-center text-sm text-gray-500 mt-6">
        Уже есть аккаунт?
        <NuxtLink
          to="/login"
          class="text-green-600 hover:underline font-medium"
        >
          Войти
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useNuxtApp, navigateTo } from "#imports"; // Nuxt 4 helpers
import { useAuthStore } from "@/stores/auth";

const form = reactive({
  email: "",
  password: "",
  adminCode: "",
});

const wantAdmin = ref(false);
const loading = ref(false);

const auth = useAuthStore();

const handleRegister = async () => {
  if (!form.email || !form.password) {
    alert("Пожалуйста, заполните email и пароль");
    return;
  }

  if (wantAdmin.value && form.adminCode !== "ADMIN123") {
    alert("Неверный секретный код администратора!");
    return;
  }

  loading.value = true;

  try {
    const { $api } = useNuxtApp();
    const role = wantAdmin.value ? "admin" : "user";

    const res = await $api.post("/auth/register", {
      email: form.email,
      password: form.password,
      role,
    });

    // Автоматический вход после регистрации
    if (res.data.token) {
      auth.loginWithToken(res.data.token, res.data.user);
      await navigateTo("/");
    } else {
      await auth.login(form.email, form.password);
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.response?.data?.message || "Ошибка регистрации";
    if (msg.includes("exists") || err.response?.status === 409) {
      alert("Пользователь с таким email уже существует");
    } else {
      alert(msg);
    }
  } finally {
    loading.value = false;
  }
};
</script>
