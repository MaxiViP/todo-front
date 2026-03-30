<template>
  <transition name="fade">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      v-if="modelValue"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="close"
    >
      <transition name="scale-fade">
        <div
          class="bg-white text-gray-900 p-6 rounded-xl w-96 relative shadow-xl"
          v-if="modelValue"
        >
          <button
            type="button"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
            @click="close"
            aria-label="Закрыть модалку"
          >
            ✕
          </button>

          <h2 id="modal-title">{{ title }}
          </h2>

          <div id="modal-desc" class="space-y-4">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.scale-fade-enter-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.scale-fade-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-fade-enter-from {
  transform: scale(0.95);
  opacity: 0;
}
.scale-fade-enter-to {
  transform: scale(1);
  opacity: 1;
}
.scale-fade-leave-from {
  transform: scale(1);
  opacity: 1;
}
.scale-fade-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
