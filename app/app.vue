<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased"
  >
    <UHeader>
      <template #left>
        <h1 class="text-2xl font-semibold tracking-tight">ToDo App</h1>
      </template>

      <template #right>
        <div class="relative">
          <!-- Большие экраны: имя -->
          <div ref="userButton">
            <!-- Большие экраны -->
            <UButton
              v-if="auth.isAuthenticated && !isMobile"
              variant="ghost"
              color="success"
              @click="toggleUserMenu"
            >
              {{ auth.user?.name || "Пользователь" }}
            </UButton>

            <!-- Малые экраны -->
            <UButton
              v-if="auth.isAuthenticated && isMobile"
              variant="ghost"
              color="success"
              @click="toggleUserMenu"
            >
              <UIcon
                :name="
                  auth.user?.role === 'admin'
                    ? 'i-lucide-shield'
                    : 'i-lucide-user'
                "
              />
            </UButton>
          </div>

          <!-- Попап меню под кнопкой -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded shadow-lg z-50"
          >
            <p
              class="px-4 py-2 border-b dark:border-gray-700 text-gray-700 dark:text-gray-200"
            >
              {{ auth.user?.name || "Пользователь" }}
            </p>
            <button
              class="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
              @click="logoutAndClose"
            >
              Выйти
            </button>
            <button
              class="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-400"
              @click="switchUser"
            >
              Сменить пользователя
            </button>
          </div>
        </div>
      </template>
    </UHeader>

    <NuxtLoadingIndicator color="#00C16A" />

    <main class="p-6 max-w-5xl mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const showUserMenu = ref(false);
const userButton = ref<HTMLElement | null>(null);

// Адаптивность
const isMobile = ref(false);
const handleResize = () => {
  isMobile.value = window.innerWidth < 640;
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
});

// Попап под кнопкой
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Закрытие по клику вне
const handleClickOutside = (e: MouseEvent) => {
  if (!userButton.value?.contains(e.target as Node) && showUserMenu.value) {
    showUserMenu.value = false;
  }
};

// Действия
const logoutAndClose = () => {
  auth.logout();
  showUserMenu.value = false;
};

const switchUser = () => {
  auth.logout();
  showUserMenu.value = false;
  // Можно добавить редирект на страницу логина
};
</script>
