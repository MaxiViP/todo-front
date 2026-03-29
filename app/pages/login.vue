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

      <!-- QR-вход -->
      <div v-else class="text-center space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Отсканируйте QR-код мобильным приложением
        </p>
        <canvas ref="qrCanvas" class="mx-auto"></canvas>
        <p class="text-sm text-gray-500">
          Используйте приложение для аутентификации (Google Authenticator и др.)
        </p>
        <UButton variant="ghost" @click="cancelQrLogin">
          Назад к входу
        </UButton>
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
import QRCode from "qrcode";

const auth = useAuthStore();

// Обычная форма
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);

// QR-вход
const showQrCode = ref(false);
const qrInitLoading = ref(false);
const qrCanvas = ref<HTMLCanvasElement | null>(null);
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let qrSessionId: string | null = null;

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
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

const startQrLogin = async () => {
  qrInitLoading.value = true;
  try {
    // Имитация запроса к серверу (замените на реальный)
    const mockResponse = await mockQrInit();
    qrSessionId = mockResponse.sessionId;
    const qrData = mockResponse.qrData;

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrData, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    }

    startPolling();
    showQrCode.value = true;
  } catch (error) {
    console.error("QR init error:", error);
    alert("Не удалось сгенерировать QR-код. Попробуйте позже.");
  } finally {
    qrInitLoading.value = false;
  }
};

const startPolling = () => {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    if (!qrSessionId) return;
    try {
      const status = await mockQrStatus(qrSessionId);
      if (status.confirmed) {
        clearPolling();
        await auth.loginWithToken(status.token);
        showQrCode.value = false;
      }
    } catch (error) {
      console.error("QR status error:", error);
    }
  }, 2000);
};

const clearPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  qrSessionId = null;
};

const cancelQrLogin = () => {
  clearPolling();
  showQrCode.value = false;
};

// ========== MOCK-ФУНКЦИИ (замените на реальные API) ==========
const mockQrInit = (): Promise<{ sessionId: string; qrData: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessionId = Math.random().toString(36).substring(2, 15);
      const qrData = `https://yourapp.com/qr?session=${sessionId}`;
      resolve({ sessionId, qrData });
    }, 500);
  });
};

let mockConfirmed = false;
const mockQrStatus = (
  sessionId: string,
): Promise<{ confirmed: boolean; token?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!mockConfirmed) {
        mockConfirmed = true;
        resolve({
          confirmed: true,
          token: "mock-jwt-token-from-qr",
        });
      } else {
        resolve({ confirmed: false });
      }
    }, 100);
  });
};
</script>
<style>
.auth-qr {
  width: 150px;
  height: 150px;
}
</style>
