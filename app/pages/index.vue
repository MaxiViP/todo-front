<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div class="relative w-full sm:w-96">
        <UInput
          v-model="search"
          placeholder="Поиск по названию..."
          class="w-full pr-10"
        />
        <Icon
          name="lucide:search"
          class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div
          ref="statusRef"
          class="relative w-full sm:w-auto min-w-[160px] text-gray-400 hover:text-gray-600"
        >
          <button
            @click="toggleStatus"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-left bg-white shadow-sm hover:border-green-400 flex justify-between items-center transition"
          >
            <span>{{ getStatusLabel(tasksStore.filterStatus) }}</span>
            <Icon
              name="lucide:chevron-down"
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': statusOpen }"
            />
          </button>

          <ul
            v-if="statusOpen"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md max-h-40 overflow-auto"
          >
            <li
              v-for="option in statusOptions"
              :key="option.value"
              @click="selectStatus(option.value)"
              class="cursor-pointer py-2 px-3 hover:bg-green-100 transition"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>

        <div
          ref="sortRef"
          class="relative w-full sm:w-auto min-w-[160px] text-gray-400 hover:text-gray-600"
        >
          <button
            @click="toggleSort"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-left bg-white shadow-sm hover:border-green-400 flex justify-between items-center transition"
          >
            <span>{{ getSortLabel(tasksStore.sortBy) }}</span>
            <Icon
              name="lucide:chevron-down"
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': sortOpen }"
            />
          </button>

          <ul
            v-if="sortOpen"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md max-h-40 overflow-auto"
          >
            <li
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option.value)"
              class="cursor-pointer py-2 px-3 hover:bg-green-100 transition"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>

        <UButton
          @click="openModal"
          class="w-full sm:w-auto group transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        >
          <span
            class="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-100"
          >
            <Icon
              name="lucide:plus"
              class="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
            />
            <span class="font-medium">Новая задача</span>
          </span>
        </UButton>
      </div>
    </div>

    <div
      v-if="tasksStore.error"
      class="text-red-600 mb-4 p-3 bg-red-50 rounded"
    >
      {{ tasksStore.error }}
    </div>

    <div
      v-if="tasksStore.loading"
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
    >
      <TaskSkeleton v-for="i in 6" :key="i" />
    </div>

    <UCard v-else-if="tasksStore.tasks?.length === 0" class="text-center py-12">
      <p class="text-gray-900" v-if="search">Ничего не найдено 😢</p>
      <p class="text-gray-900" v-else>Нет задач. Создайте первую!</p>
    </UCard>

    <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      <TaskCard
        v-for="task in tasksStore.tasks"
        :key="task.id"
        :task="task"
        @edit="editTask"
        @delete="deleteTask"
      />
    </div>

    <div v-if="tasksStore.total > 0" class="flex justify-center mt-6 gap-2">
      <UButton
        :disabled="tasksStore.loading || tasksStore.page === 1"
        @click="debouncedPrevPage"
      >
        Назад
      </UButton>

      <span class="px-3 py-1 font-medium">
        {{ tasksStore.page }} / {{ totalPages }}
      </span>

      <UButton
        :disabled="tasksStore.loading || tasksStore.page >= totalPages"
        @click="debouncedNextPage"
      >
        Вперёд
      </UButton>
    </div>

    <UModal
      v-model="showModal"
      :title="editingTask ? 'Редактировать задачу' : 'Новая задача'"
    >
      <TaskForm
        :key="editingTask?.id || 'new'"
        :initial="editingTask"
        @save="handleSave"
        @cancel="closeModal"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDebounceFn, onClickOutside } from "@vueuse/core";
import { useTasksStore } from "@/stores/tasks";
import { definePageMeta } from "#imports";
import UModal from "@/components/ui/AppModal.vue";
import TaskCard from "@/components/task/TaskCard.vue";
import TaskForm from "@/components/task/TaskForm.vue";
import UButton from "@/components/ui/UButton.vue";
import UCard from "@/components/ui/UCard.vue";
import UInput from "@/components/ui/UInput.vue";
import TaskSkeleton from "@/components/task/TaskSkeleton.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "#imports";

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const toast = useToast();

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      tasksStore.fetchTasks();
    }
  },
  { immediate: true },
);

definePageMeta({ middleware: "auth" });

const showModal = ref(false);
const editingTask = ref<any>(null);

const sortOpen = ref(false);
const statusOpen = ref(false);

const sortRef = ref();
const statusRef = ref();

const search = computed({
  get: () => tasksStore.search,
  set: (val) => {
    tasksStore.search = val;
  },
});

const totalPages = computed(() =>
  tasksStore.limit ? Math.ceil(tasksStore.total / tasksStore.limit) : 1,
);

const debouncedPrevPage = useDebounceFn(() => {
  if (tasksStore.page > 1) tasksStore.page--;
}, 80);

const debouncedNextPage = useDebounceFn(() => {
  if (tasksStore.page < totalPages.value) tasksStore.page++;
}, 80);

const toggleSort = () => {
  sortOpen.value = !sortOpen.value;
  statusOpen.value = false;
};

const toggleStatus = () => {
  statusOpen.value = !statusOpen.value;
  sortOpen.value = false;
};

const selectSort = (value: string) => {
  if (value === "date" || value === "status") {
    tasksStore.sortBy = value;
    sortOpen.value = false;
    tasksStore.fetchTasks();
  }
};

const selectStatus = (value: string) => {
  tasksStore.filterStatus = value;
  statusOpen.value = false;
  tasksStore.fetchTasks();
};

const getSortLabel = (value: string) => {
  return sortOptions.find((o) => o.value === value)?.label || "По дате";
};

const getStatusLabel = (value: string) => {
  return statusOptions.find((o) => o.value === value)?.label || "Все задачи";
};

onClickOutside(sortRef, () => (sortOpen.value = false));
onClickOutside(statusRef, () => (statusOpen.value = false));

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
  try {
    if (editingTask.value?.id) {
      await tasksStore.updateTask(editingTask.value.id, formData);
      toast.add({
        title: "Задача обновлена",
        description: "Изменения успешно сохранены",
        color: "green",
        icon: "i-lucide-check-circle",
      });
    } else {
      await tasksStore.createTask(formData);
      toast.add({
        title: "Задача создана",
        description: "Новая задача добавлена в список",
        color: "green",
        icon: "i-lucide-check-circle",
      });
    }
    closeModal();
  } catch (e: any) {
    toast.add({
      title: "Ошибка сохранения",
      description: e?.message || "Не удалось сохранить задачу. Попробуйте ещё раз.",
      color: "red",
      icon: "i-lucide-alert-circle",
    });
  }
};

const deleteTask = async (id: string) => {
  if (!confirm("Удалить задачу?")) return;

  try {
    await tasksStore.deleteTask(id);
    toast.add({
      title: "Задача удалена",
      description: "Задача успешно удалена из списка",
      color: "green",
      icon: "i-lucide-check-circle",
    });
  } catch (e: any) {
    toast.add({
      title: "Ошибка удаления",
      description: e?.message || "Не удалось удалить задачу. Попробуйте ещё раз.",
      color: "red",
      icon: "i-lucide-alert-circle",
    });
  }
};

const statusOptions = [
  { value: "", label: "Все задачи" },
  { value: "false", label: "Активные" },
  { value: "true", label: "Выполненные" },
];

const sortOptions = [
  { value: "date", label: "По дате" },
  { value: "status", label: "По статусу" },
];
</script>

<style>
.card {
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
}
</style>
