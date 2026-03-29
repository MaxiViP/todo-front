<template>
  <UCard class="h-full flex flex-col">
    <div class="flex justify-between items-start">
      <h3 class="font-medium">{{ task.title }}</h3>

      <!-- Кнопка выполнено -->
      <UButton
        size="sm"
        :color="localCompleted ? 'success' : 'neutral'"
        variant="outline"
        @click="toggleComplete"
      >
        {{ localCompleted ? "✅ Выполнено" : "⬜ Не выполнено" }}
      </UButton>
    </div>

    <!-- Приоритет -->
    <div class="mt-2 flex items-center gap-1">
      <span
        :class="priorityClass"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      >
        <span>{{ priorityIcon }}</span>
        <span>{{ priorityLabel }}</span>
      </span>
    </div>

    <p v-if="task.description" class="text-sm text-gray-600 mt-2 line-clamp-2">
      {{ task.description }}
    </p>

    <div v-if="canManage" class="mt-auto pt-4 flex gap-2">
      <UButton size="sm" variant="outline" @click="$emit('edit', task)">
        ✏️ Редактировать
      </UButton>
      <UButton
        size="sm"
        color="error"
        variant="ghost"
        @click="$emit('delete', task.id)"
      >
        🗑 Удалить
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTasksStore } from "@/stores/tasks";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{ task: any }>();
const emit = defineEmits(["edit", "delete"]);

const auth = useAuthStore();
const tasksStore = useTasksStore();

const canManage = computed(() => {
  return auth.user?.role === "admin" || auth.user?.id === props.task.userId;
});

// Локальный стейт для кнопки
const localCompleted = ref(props.task.isCompleted);

// Следим за изменением задачи извне и синхронизируем локальный стейт
watch(
  () => props.task.isCompleted,
  (v) => (localCompleted.value = v),
);

// Приоритет
const priority = computed(() => props.task.priority || "normal");

const priorityLabel = computed(() => {
  switch (priority.value) {
    case "low":
      return "Низкий";
    case "high":
      return "Высокий";
    default:
      return "Обычный";
  }
});

const priorityIcon = computed(() => {
  switch (priority.value) {
    case "low":
      return "🔽";
    case "high":
      return "🔺";
    default:
      return "➡️";
  }
});

const priorityClass = computed(() => {
  switch (priority.value) {
    case "low":
      return "bg-green-100 text-green-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

// Обновление статуса задачи
const toggleComplete = async () => {
  localCompleted.value = !localCompleted.value;
  try {
    await tasksStore.updateTask(props.task.id, {
      isCompleted: localCompleted.value,
    });
  } catch (err) {
    console.error("Ошибка обновления статуса задачи:", err);
    // Если ошибка, откатываем визуально
    localCompleted.value = !localCompleted.value;
  }
};
</script>
