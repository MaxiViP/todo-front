<template>
  <div class="flex gap-2 mb-4">
    <select v-model="sort">
      <option value="date">По дате</option>
      <option value="status">По статусу</option>
    </select>

    <select v-model="status">
      <option value="">Все</option>
      <option value="true">Выполненные</option>
      <option value="false">Активные</option>
    </select>
  </div>
</template>

<script setup>
const tasks = useTasksStore()

const sort = computed({
  get: () => tasks.sortBy,
  set: (v) => {
    tasks.sortBy = v
    tasks.fetchTasks()
  },
})

const status = computed({
  get: () => tasks.filterStatus,
  set: (v) => {
    tasks.filterStatus = v
    tasks.fetchTasks()
  },
})
</script>
