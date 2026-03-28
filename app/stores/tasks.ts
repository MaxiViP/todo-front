// stores/tasks.ts
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

  const { $api } = useNuxtApp();

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $api.get("/tasks", {
        params: {
          search: search.value || undefined,
          status: filterStatus.value || undefined,
          page: page.value,
          limit: 15,
        },
      });
      tasks.value = res.data;
    } catch (e: any) {
      console.error(e);

      if (e.response?.status === 401) {
        const auth = useAuthStore();
        auth.logout();
        return;
      }

      error.value = e.response?.data?.message || "Ошибка при загрузке задач";
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData: any) => {
    await $api.post("/tasks", taskData);
    await fetchTasks();
  };

  const updateTask = async (id: string, updates: any) => {
    await $api.put(`/tasks/${id}`, updates);
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await $api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  const debouncedFetch = useDebounceFn(fetchTasks, 350);

  watch([search, filterStatus, sortBy], () => {
    page.value = 1;
    debouncedFetch();
  });

  return {
    tasks,
    loading,
    error,
    search,
    filterStatus,
    sortBy,
    page,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
