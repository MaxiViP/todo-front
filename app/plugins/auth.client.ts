// plugins/auth.client.ts
import { defineNuxtPlugin } from "#imports"; // 🔹 добавляем импорт

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (msg: string) => {
        console.log("🔔", msg); // пока заглушка
      },
    },
  };
});
