<template>
  <div :class="['border p-4 rounded shadow-sm bg-white',]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

defineProps<Props>();
</script>
