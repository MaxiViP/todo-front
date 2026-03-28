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

    <div v-if="canManage" class="mt-auto pt-4 flex gap-2">
      <UButton size="sm" variant="outline" @click="$emit('edit', task)">
        ✏️ Редактировать
      </UButton>
      <UButton size="sm" color="success" variant="ghost" @click="$emit('delete', task.id)">
        🗑 Удалить
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{ task: any }>()
const emit = defineEmits(['edit', 'delete'])
const auth = useAuthStore()

const canManage = computed(() => {
  return auth.user?.role === 'admin' || auth.user?.id === props.task.userId
})

const localCompleted = ref(props.task.isCompleted)

const tasksStore = useTasksStore()
const toggleComplete = async () => {
  await tasksStore.updateTask(props.task.id, { isCompleted: localCompleted.value })
  watch(
  () => props.task.isCompleted,
  (v) => (localCompleted.value = v)
)
}
</script>
