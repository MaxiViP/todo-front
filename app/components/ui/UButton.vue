<template>
  <button
    :class="['px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50', ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  class?: string;
  disabled?: boolean;
}

defineProps<Props>();
</script>
