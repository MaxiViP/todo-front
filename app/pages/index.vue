<!-- pages/index.vue -->
<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-8">
      <UInput
        v-model="tasksStore.search"
        placeholder="Поиск по названию..."
        icon="i-lucide-search"
        class="w-full sm:w-96"
      />

      <div class="flex gap-3">
        <USelect v-model="tasksStore.filterStatus" :options="statusOptions" />
        <USelect v-model="tasksStore.sortBy" :options="sortOptions" />

        <UButton icon="i-lucide-plus" @click="openModal">
          Новая задача
        </UButton>
      </div>
    </div>

    <div v-if="tasksStore.error" class="text-red-500 mb-4 p-3 bg-red-50 rounded">
      {{ tasksStore.error }}
    </div>

    <!-- Loading -->
    <div v-if="tasksStore.loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-green-500" />
    </div>

    <!-- Empty -->
    <UCard v-else-if="tasksStore.tasks.length === 0" class="text-center py-12">
      <p class="text-gray-500">Нет задач. Создайте первую!</p>
    </UCard>

    <!-- Tasks grid -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TaskCard
        v-for="task in tasksStore.tasks"
        :key="task.id"
        :task="task"
        @edit="editTask"
        @delete="deleteTask"
      />
    </div>

    <!-- Modal -->
    <UModal
      v-model="showModal"
      :title="editingTask ? 'Редактировать задачу' : 'Новая задача'"
    >
      <TaskForm :initial="editingTask" @save="handleSave" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const tasksStore = useTasksStore();
const showModal = ref(false);
const editingTask = ref<any>(null);

const statusOptions = [
  { value: "", label: "Все задачи" },
  { value: "false", label: "Активные" },
  { value: "true", label: "Выполненные" },
];

const sortOptions = [
  { value: "date", label: "По дате" },
  { value: "status", label: "По статусу" },
];

onMounted(() => {
  tasksStore.fetchTasks();
});

const openModal = () => {
  editingTask.value = null;
  showModal.value = true;
};

const editTask = (task: any) => {
  editingTask.value = { ...task };
  showModal.value = true;
};

const handleSave = async (formData: any) => {
  if (editingTask.value) {
    await tasksStore.updateTask(editingTask.value.id, formData);
  } else {
    await tasksStore.createTask(formData);
  }
  showModal.value = false;
};

const deleteTask = async (id: string) => {
  if (confirm("Удалить задачу?")) {
    await tasksStore.deleteTask(id);
  }
};
</script>
