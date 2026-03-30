import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (msg: string) => {
        console.log("🔔", msg);
      },
    },
  };
});
