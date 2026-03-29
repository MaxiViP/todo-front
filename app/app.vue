<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased"
  >
    <UHeader>
      <template #left>
        <h1 class="text-2xl font-semibold tracking-tight">ToDo App</h1>
      </template>
      <template #right>
        <div class="relative" ref="userButton">
          <UButton
            v-if="auth.isAuthenticated && !isMobile"
            variant="ghost"
            color="success"
            @click="toggleUserMenu"
          >
            {{
              auth.user?.role === "admin"
                ? "Администратор"
                : auth.user?.email || "Пользователь"
            }}
          </UButton>

          <!-- Малые экраны: только иконка -->
          <UButton
            v-if="auth.isAuthenticated && isMobile"
            variant="ghost"
            color="success"
            @click="toggleUserMenu"
          >
            <UIcon
              :name="
                auth.user?.role === 'admin'
                  ? 'i-lucide-shield-check'
                  : 'i-lucide-user'
              "
              class="w-5 h-5"
            />
          </UButton>

          <!-- Попап меню -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1"
          >
            <div class="px-4 py-3 border-b dark:border-gray-700">
              <p class="font-medium">
                {{ auth.user?.email || "Пользователь" }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{
                  auth.user?.role === "admin" ? "Администратор" : "Пользователь"
                }}
              </p>
            </div>

            <button
              class="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center gap-2"
              @click="switchUser"
            >
              <UIcon name="i-lucide-log-in" class="w-4 h-4" />
              Сменить пользователя
            </button>

            <button
              class="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2"
              @click="logoutAndClose"
            >
              <UIcon name="i-lucide-log-out" class="w-4 h-4" />
              Выйти
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
import { useAuthStore } from "~/stores/auth";

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
