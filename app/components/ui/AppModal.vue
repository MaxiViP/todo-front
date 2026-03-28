<!-- AppModal.vue -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white p-6 rounded-xl w-96 relative">
      <!-- Кнопка закрыть -->
      <button
        type="button"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="close"
      >
        ✕
      </button>

      <!-- Заголовок -->
      <h2 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h2>

      <!-- Слот с контентом -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* Можно добавить анимацию появления */
</style>
