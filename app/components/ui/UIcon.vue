<template>
  <i :class="['inline-block', name, ]"></i>
</template>

<script setup lang="ts">
defineProps({
  name: String,
  class: String,
});
</script>
