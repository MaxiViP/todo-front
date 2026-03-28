<template>
  <div>
    <!-- Фильтры и поиск -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <UInput
        v-model="search"
        placeholder="Поиск по названию..."
        icon="i-lucide-search"
        class="w-full sm:w-96"
      />

      <div class="flex gap-3">
        <USelect v-model="tasksStore.filterStatus" :options="statusOptions" />
        <USelect v-model="tasksStore.sortBy" :options="sortOptions" />
        <UButton icon="i-lucide-plus" @click="openModal" color="success">
          Новая задача
        </UButton>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-if="tasksStore.error" class="text-red-600 mb-4 p-3 bg-red-50 rounded">
      {{ tasksStore.error }}
    </div>

    <!-- Загрузка -->
    <div v-if="tasksStore.loading" class="flex justify-center py-12">
      <AppSpinner />
    </div>

    <!-- Пусто / ничего не найдено -->
    <UCard v-else-if="tasksStore.tasks?.length === 0" class="text-center py-12">
      <p v-if="search">Ничего не найдено 😢</p>
      <p v-else>Нет задач. Создайте первую!</p>
    </UCard>

    <!-- Сетка задач -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TaskCard
        v-for="task in tasksStore.tasks"
        :key="task.id"
        :task="task"
        @edit="editTask"
        @delete="deleteTask"
      />
    </div>

    <!-- Пагинация -->
    <div v-if="tasksStore.tasks?.length" class="flex justify-center mt-6 gap-2">
      <UButton :disabled="tasksStore.page === 1" @click="prevPage">Назад</UButton>
      <span class="px-3 py-1 font-medium">{{ tasksStore.page }} / {{ totalPages }}</span>
      <UButton :disabled="tasksStore.page >= totalPages" @click="nextPage">Вперёд</UButton>
    </div>

    <!-- Модалка -->
    <UModal
      v-model="showModal"
      :title="editingTask ? 'Редактировать задачу' : 'Новая задача'"
    >
      <TaskForm
        :initial="editingTask"
        @save="handleSave"
        @cancel="closeModal"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useTasksStore } from "@/stores/tasks";

import UModal from "@/components/ui/AppModal.vue";
import TaskCard from "@/components/task/TaskCard.vue";
import TaskForm from "@/components/task/TaskForm.vue";

import UButton from "@/components/ui/UButton.vue";
import UCard from "@/components/ui/UCard.vue";
import UInput from "@/components/ui/UInput.vue";
import USelect from "@/components/ui/USelect.vue";

definePageMeta({ middleware: "auth" });

const tasksStore = useTasksStore();
const showModal = ref(false);
const editingTask = ref<any>(null);
const search = ref(tasksStore.search);

const totalPages = computed(() =>
  tasksStore.limit ? Math.ceil(tasksStore.total / tasksStore.limit) : 1
);

const debouncedFetch = useDebounceFn(() => {
  tasksStore.page = 1;
  tasksStore.search = search.value;
  tasksStore.fetchTasks();
}, 400);

watch(search, debouncedFetch);

watch(
  [() => tasksStore.filterStatus, () => tasksStore.sortBy],
  () => {
    tasksStore.page = 1;
    tasksStore.fetchTasks();
  }
);

onMounted(() => tasksStore.fetchTasks());

// Pagination
const prevPage = () => {
  if (tasksStore.page > 1) {
    tasksStore.page--;
    tasksStore.fetchTasks();
  }
};
const nextPage = () => {
  if (tasksStore.page < totalPages.value) {
    tasksStore.page++;
    tasksStore.fetchTasks();
  }
};

// Modal
const openModal = () => {
  editingTask.value = null;
  showModal.value = true;
};
const editTask = (task: any) => {
  editingTask.value = { ...task };
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  editingTask.value = null;
};
const handleSave = async (formData: any) => {
  if (editingTask.value?.id) {
    await tasksStore.updateTask(editingTask.value.id, formData);
  } else {
    await tasksStore.createTask(formData);
  }
  closeModal();
  await tasksStore.fetchTasks();
};
const deleteTask = async (id: string) => {
  if (confirm("Удалить задачу?")) await tasksStore.deleteTask(id);
};

// Options
const statusOptions = [
  { value: null, label: "Все задачи" },
  { value: false, label: "Активные" },
  { value: true, label: "Выполненные" },
];
const sortOptions = [
  { value: "date", label: "По дате" },
  { value: "status", label: "По статусу" },
];
</script>
