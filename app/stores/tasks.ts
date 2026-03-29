import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth"; // предполагаем, что у тебя есть auth store

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

  // Основной запрос
  const fetchTasks = async () => {
    if (!useAuthStore().isAuthenticated) return;

    console.log(
      "📡 FETCH TASKS → page:",
      page.value,
      "search:",
      search.value,
      "status:",
      filterStatus.value,
    );

    loading.value = true;
    error.value = null;

    try {
      const { data } = await $api.get("/tasks", {
        params: {
          page: page.value,
          limit: limit.value,
          search: search.value || undefined,
          status: filterStatus.value || undefined,
          sort: sortBy.value,
        },
      });

      tasks.value = data.tasks || [];
      total.value = data.total || 0;
    } catch (e: any) {
      console.error(e);
      error.value = e.message || "Ошибка загрузки задач";
    } finally {
      loading.value = false;
    }
  };

  // Мутации (после успеха сразу обновляем список)
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

  // Debounce только для поиска
  const debouncedSearch = useDebounceFn(() => {
    fetchTasks();
  }, 350);

  // Поиск → сбрасываем страницу + debounced запрос
  watch(search, () => {
    page.value = 1;
    debouncedSearch();
  });

  // Смена фильтра или сортировки → сбрасываем на 1 страницу
  watch([filterStatus, sortBy], () => {
    page.value = 1;
    fetchTasks();
  });

  // Смена страницы (пагинация)
  watch(
    page,
    () => {
      fetchTasks();
    },
    { immediate: true }, // ← начальная загрузка
  );

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
