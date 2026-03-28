<!-- TaskCard.vue -->
<template>
  <UCard class="h-full flex flex-col">
    <div class="flex justify-between items-start">
      <h3 class="font-medium">{{ task.title }}</h3>
      <UToggle v-model="localCompleted" @change="toggleComplete" />
    </div>

    <p v-if="task.description" class="text-sm text-gray-600 mt-2 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="mt-auto pt-4 flex gap-2">
      <UButton size="sm" variant="outline" @click="$emit('edit', task)">
        ✏️ Редактировать
      </UButton>
      <UButton size="sm" color="red" variant="ghost" @click="$emit('delete', task.id)">
        🗑 Удалить
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{ task: any }>()
const emit = defineEmits(['edit', 'delete'])

const localCompleted = ref(props.task.isCompleted)

const toggleComplete = async () => {
  // Можно сразу обновить через store
}
</script>
