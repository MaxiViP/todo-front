const sortBy = ref<'date' | 'status'>('date')

const page = ref(1);

const nextPage = () => {
  page.value++;
  fetchTasks();
};

const fetchTasks = async () => {
  loading.value = true

  try {
    const { $api } = useNuxtApp()

    const res = await $api.get('/tasks', {
      params: {
        search: search.value,
        status: filterStatus.value,
        page: page.value,
        limit: 10,
      },
    })

    let data = res.data

    // сортировка на фронте
    if (sortBy.value === 'status') {
      data.sort((a, b) => a.isCompleted - b.isCompleted)
    }

    tasks.value = data
  } finally {
    loading.value = false
  }
}
