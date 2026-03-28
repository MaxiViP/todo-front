<template>
  <div v-if="!tasksStore.loading" class="p-6">
    <div class="flex justify-between mb-4">
      <input v-model="search" placeholder="Поиск..." class="input" />
      <button class="btn" @click="openModal">+ Добавить</button>
    </div>

    <div v-if="!tasksStore.tasks.length">Нет задач 😢</div>

    <div class="grid gap-4">
      <div
        v-for="task in tasksStore.tasks"
        :key="task.id"
        class="p-4 bg-white shadow rounded"
      >
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>

        <button class="text-red-500" @click="tasksStore.deleteTask(task.id)">
          Удалить
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center p-10">Loading...</div>
</template>

<script setup>
const search = ref("");

const debounced = useDebounce(() => {
  tasks.fetchTasks();
}, 500);

watch(search, (v) => {
  tasks.search = v;
  debounced();
});

  // <div v-if="!tasks.tasks.length && !tasks.loading">Ничего не найдено 😢</div>

definePageMeta({ middleware: "auth" });

const tasksStore = useTasksStore();

const search = ref("");

const debounced = useDebounce(() => {
  tasksStore.fetchTasks({ search: search.value });
}, 500);

watch(search, debounced);

onMounted(() => {
  tasksStore.fetchTasks();
});
</script>
