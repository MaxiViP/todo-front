<template>
  <select
    :class="[
      'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500',
    ]"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  class: String,
});
</script>
