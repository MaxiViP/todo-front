<template>
  <UCard
    class="flex flex-col relative transition hover:shadow-md border"
    :class="localCompleted ? 'opacity-70' : ''"
  >
    <div class="absolute top-2 left-3">
      <span
        :class="priorityClass"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      >
        <span>{{ priorityIcon }}</span>
        <span>{{ priorityLabel }}</span>
      </span>
    </div>

    <div class="flex justify-between items-start pt-4">
      <h3
        class="font-semibold text-base leading-tight"
        :class="localCompleted ? 'line-through text-gray-400' : ''"
      >
        {{ task.title }}
      </h3>

      <UButton
        size="xs"
        :color="localCompleted ? 'success' : 'neutral'"
        variant="soft"
        @click="toggleComplete"
      >
        выполнен
        {{ localCompleted ? "✔" : "○" }}
      </UButton>
    </div>
    <p
      v-if="task.description"
      class="text-sm text-gray-500 mt-2 max-h-24 overflow-y-auto break-words pr-1"
    >
      {{ task.description }}
    </p>
    <div
      v-if="canManage"
      class="mt-auto pt-4 flex justify-between items-center"
    >
      <div v-if="task.dueDate" class="text-xs text-gray-400">
        📅 {{ formattedDueDate }}
      </div>
      <div v-else></div>
      <div class="flex gap-2">
        <UButton size="xs" variant="ghost" @click="$emit('edit', task)"
          >Редактировать ✏️</UButton
        >
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          @click="$emit('delete', task.id)"
          >Удалить 🗑</UButton
        >
      </div>
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

const localCompleted = ref(props.task.isCompleted);

watch(
  () => props.task.isCompleted,
  (v) => (localCompleted.value = v),
);

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

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return "";
  try {
    const date = new Date(props.task.dueDate);
    if (isNaN(date.getTime())) return props.task.dueDate; // fallback
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch {
    return props.task.dueDate;
  }
});

const toggleComplete = async () => {
  localCompleted.value = !localCompleted.value;
  try {
    await tasksStore.updateTask(props.task.id, {
      isCompleted: localCompleted.value,
    });
  } catch (err) {
    console.error("Ошибка обновления статуса задачи:", err);
    localCompleted.value = !localCompleted.value;
  }
};
</script>
<style scoped>
:deep([data-slot="body"]) {
  height: -webkit-fill-available;
  height: -moz-available;
  height: stretch;
  display: flex;
  flex-direction: column;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
