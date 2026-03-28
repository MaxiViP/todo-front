<template>
  <input
    :class="[
      'w-full px-3 py-2 rounded-md border text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400',
      'hover:border-green-300',
      disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
      customClass
    ]"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
  class?: string
  disabled?: boolean
}>()

const customClass = props.class || ''
const disabled = props.disabled || false
</script>
