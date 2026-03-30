<template>
  <select
    v-model="modelValue"
    :class="[
      'w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5',
      'text-gray-900 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-300',
      'transition-colors cursor-pointer',
      props.class,
    ]"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string | number | null;
  options: Array<{ value: any; label: string }>;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
