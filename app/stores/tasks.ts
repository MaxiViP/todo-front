import { defineStore } from "pinia";
import { useDebounceFn } from "@vueuse/core";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const search = ref("");
  const filterStatus = ref<string>("");
  const sortBy = ref<"date" | "status">("date");
  const page = ref(1);
  const limit = ref(12);
  const total = ref(0);

  const { $api } = useNuxtApp();

  const fetchTasks = async () => {
    if (!useAuthStore().isAuthenticated) return;
    console.log("FETCH PAGE:", page.value);
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $api.get("/tasks", {
        params: {
          page: page.value,
          limit: limit.value,
          search: search.value,
          status: filterStatus.value ?? undefined, // ✅ чисто и правильно
          sort: sortBy.value,
        },
      });

      tasks.value = data.tasks || [];
      total.value = data.total || 0;
    } catch (e: any) {
      error.value = e.message || "Ошибка загрузки";
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData: any) => {
    console.log("API POST /tasks:", taskData);
    await $api.post("/tasks", taskData);
    await fetchTasks(); // ✅ один fetch
  };

  const updateTask = async (id: string, updates: any) => {
    await $api.put(`/tasks/${id}`, updates);
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await $api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  // debounce только для поиска
  const debouncedSearch = useDebounceFn(() => {
    fetchTasks();
  }, 350);

  watch(
    page,
    () => {
      fetchTasks();
    },
    { immediate: true },
  );

  watch([filterStatus, sortBy], () => {
    page.value = 1;
  });

  // поиск
  watch(search, () => {
    page.value = 1;
    debouncedSearch();
  });

  return {
    tasks,
    loading,
    error,
    search,
    filterStatus,
    sortBy,
    page,
    limit,
    total,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
