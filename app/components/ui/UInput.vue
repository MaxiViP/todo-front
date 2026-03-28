<template>
  <input
    :class="[
      'border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500',
    
    ]"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
defineProps({
  modelValue: String,
  placeholder: String,
  class: String,
});
</script>
