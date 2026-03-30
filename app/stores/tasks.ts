import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth";
import type { Task } from "@/types/task";
import { useNuxtApp } from "#app";

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
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

      tasks.value = (data.tasks || []).map((task: any) => ({
        ...task,
        isCompleted: Boolean(task.isCompleted),
      }));
      total.value = data.total || 0;
    } catch (e: any) {
      error.value = e.message || "Ошибка загрузки задач";
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData: any) => {
    await $api.post("/tasks", taskData);
    await fetchTasks();
  };

  const updateTask = async (id: string, updates: any) => {
    const index = tasks.value.findIndex((t) => t.id === id);

    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
      };
    }

    try {
      await $api.put(`/tasks/${id}`, {
        ...updates,
        isCompleted:
          updates.isCompleted !== undefined
            ? Boolean(updates.isCompleted)
            : undefined,
      });
    } catch (e) {
      await fetchTasks();
      throw e;
    }
  };

  const deleteTask = async (id: string) => {
    const prev = [...tasks.value];

    tasks.value = tasks.value.filter((t) => t.id !== id);

    try {
      await $api.delete(`/tasks/${id}`);
    } catch (e) {
      tasks.value = prev;
      throw e;
    }
  };

  const debouncedSearch = useDebounceFn(() => {
    fetchTasks();
  }, 350);

  watch(
    () => [page.value, search.value, sortBy.value, filterStatus.value],
    () => {
      fetchTasks();
    },
    { deep: true },
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
