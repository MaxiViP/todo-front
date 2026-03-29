<template>
  <div class="filters-container flex flex-wrap gap-4">
    <!-- Сортировка -->
    <div class="flex-1 min-w-[180px]">
      <label class="block text-gray-700 mb-1.5 font-medium">Сортировать</label>
      <USelect
        v-model="sort"
        :options="sortOptions"
        class="bg-gray-50 border border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-300"
      />
    </div>

    <!-- Фильтр по статусу -->
    <div class="flex-1 min-w-[180px]">
      <label class="block text-gray-700 mb-1.5 font-medium">Статус</label>
      <USelect
        v-model="status"
        :options="statusOptions"
        class="bg-gray-50 border border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-300"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTasksStore } from "~/stores/tasks";

const tasks = useTasksStore();

// Опции для сортировки
const sortOptions = [
  { value: "date", label: "По дате" },
  { value: "status", label: "По статусу" },
];

// Опции для фильтра статуса
const statusOptions = [
  { value: "", label: "Все задачи" },
  { value: "true", label: "Выполненные" },
  { value: "false", label: "Активные" },
];

// Реактивные значения через store
const sort = computed({
  get: () => tasks.sortBy,
  set: (v) => {
    tasks.sortBy = v;
    tasks.fetchTasks();
  },
});

const status = computed({
  get: () => tasks.filterStatus,
  set: (v) => {
    tasks.filterStatus = v;
    tasks.fetchTasks();
  },
});
</script>
