<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"
  >
    <UCard class="w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-center">Вход в ToDo App</h2>

      <!-- Обычная форма входа -->
      <div v-if="!showQrCode">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Flex-контейнер для полей и QR-кнопки -->
          <div class="flex items-start gap-3">
            <div class="flex-1 space-y-5">
              <UFormField label="Email" required>
                <UInput
                  v-model="email"
                  type="email"
                  placeholder="admin@test.com"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Пароль" required>
                <UInput
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  size="lg"
                />
              </UFormField>

              <div class="flex items-center gap-2">
                <UCheckbox v-model="rememberMe" id="rememberMe" />
                <label
                  for="rememberMe"
                  class="text-sm text-gray-600 dark:text-gray-300"
                >
                  Запомнить меня
                </label>
              </div>
            </div>

            <!-- Квадратная кнопка с QR-кодом справа -->
            <button
              type="button"
              @click="startQrLogin"
              class="auth-qr w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :disabled="qrInitLoading"
            >
              <UIcon name="i-heroicons-qr-code" class="w-6 h-6" />
            </button>
          </div>

          <UButton
            type="submit"
            color="success"
            size="lg"
            class="w-full"
            :loading="loading"
          >
            Войти
          </UButton>
        </form>
      </div>

      <!-- QR-вход → ЗАГЛУШКА (демо-режим) -->
      <div v-else class="text-center space-y-6">
        <p class="text-gray-700 dark:text-gray-300">
          Отсканируйте QR-код мобильным приложением
        </p>

        <!-- Заглушка вместо canvas -->
        <div
          class="mx-auto w-52 h-52 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-900 shadow-inner cursor-pointer hover:border-green-500 transition-colors"
          @click="demoQrClick"
        >
          <div class="text-center px-6">
            <UIcon
              name="i-heroicons-qr-code"
              class="w-12 h-12 mx-auto mb-3 text-gray-400"
            />
            <p class="font-medium text-gray-500 dark:text-gray-400 mb-1">
              Заглушка QR-кода
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">Демо-режим</p>
          </div>
        </div>

        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-500">
            Или выберите тестового пользователя:
          </p>

          <!-- Кнопка Admin -->
          <button
            @click="demoLoginAs('admin')"
            class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl transition-all active:scale-[0.97]"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center text-sm font-bold"
              >
                A
              </div>
              <div class="text-left">
                <p class="font-semibold">Admin</p>
                <p class="text-xs text-gray-500">admin@test.com / admin123</p>
              </div>
            </div>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5 text-gray-400"
            />
          </button>

          <!-- Кнопка User -->
          <button
            @click="demoLoginAs('user')"
            class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl transition-all active:scale-[0.97]"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-sm font-bold"
              >
                U
              </div>
              <div class="text-left">
                <p class="font-semibold">User</p>
                <p class="text-xs text-gray-500">user@test.com / 123456</p>
              </div>
            </div>
            <UIcon
              name="i-heroicons-arrow-right"
              class="w-5 h-5 text-gray-400"
            />
          </button>
        </div>

        <UButton variant="ghost" @click="cancelQrLogin" class="mt-2">
          Назад к входу
        </UButton>

        <p class="text-xs text-gray-400">
          (В реальном приложении здесь был бы настоящий QR-код)
        </p>
      </div>

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
import { ref, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

// Обычная форма
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);

// QR-вход (демо)
const showQrCode = ref(false);
const qrInitLoading = ref(false);

onUnmounted(() => {
  // Ничего не чистим — polling удалён
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Введите email и пароль");
    return;
  }

  loading.value = true;
  try {
    await auth.login(email.value, password.value, rememberMe.value);
  } catch (err: any) {
    alert(err.response?.data?.message || "Неверный email или пароль");
  } finally {
    loading.value = false;
  }
};

// Запуск «QR-входа» — просто показываем заглушку
const startQrLogin = async () => {
  qrInitLoading.value = true;
  // Имитация небольшой задержки (как будто запрашиваем QR)
  await new Promise((resolve) => setTimeout(resolve, 400));
  showQrCode.value = true;
  qrInitLoading.value = false;
};

// Клик по заглушке QR-кода — просто уведомление (можно убрать, если не нужно)
const demoQrClick = () => {
  alert("Это заглушка QR-кода.\n\nВыберите тестового пользователя ниже 👇");
};

// Автоматический вход по демо-пользователям
const demoLoginAs = async (role: "admin" | "user") => {
  let demoEmail = "";
  let demoPassword = "";

  if (role === "admin") {
    demoEmail = "admin@test.com";
    demoPassword = "admin123";
  } else {
    demoEmail = "user@test.com";
    demoPassword = "123456";
  }

  showQrCode.value = false; // сразу скрываем QR-режим

  loading.value = true;
  try {
    // Используем тот же метод, что и в обычном логине
    await auth.login(demoEmail, demoPassword, true); // rememberMe = true для демо
  } catch (err: any) {
    alert(err.response?.data?.message || "Ошибка входа");
    showQrCode.value = true; // если вдруг ошибка — возвращаем обратно
  } finally {
    loading.value = false;
  }
};

const cancelQrLogin = () => {
  showQrCode.value = false;
};

useHead({
  title: "Вход в Todo App",
  meta: [
    {
      name: "description",
      content: "Войдите в свой аккаунт, чтобы управлять задачами.",
    },
  ],
});
</script>

<style>
.auth-qr {
  width: 150px;
  height: 150px;
}
</style>
