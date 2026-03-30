<template>
  <form class="space-y-5" @submit.prevent="submit">
    <UInput
      v-model="form.title"
      label="Название"
      required
      class="w-full bg-gray-50 border border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-300 rounded-md"
    />

    <UTextarea
      v-model="form.description"
      label="Описание"
      :rows="3"
      class="w-full bg-gray-50 border border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-300 rounded-md"
    />

    <UInput
      v-model="form.dueDate"
      type="date"
      label="Срок выполнения"
      required
      class="bg-gray-50 border border-gray-300 focus:border-green-400 focus:ring-1 focus:ring-green-300 rounded-md"
    />

    <div class="relative">
      <label class="block text-gray-700 mb-1 font-medium">Приоритет</label>
      <button
        type="button"
        @click="toggleDropdown"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-left bg-white shadow-sm hover:border-green-400 flex justify-between items-center transition"
      >
        <span>{{ priorityLabel(form.priority) }}</span>
        <svg
          class="w-4 h-4 ml-2 transform transition-transform"
          :class="{ 'rotate-180': dropdownOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <ul
        v-if="dropdownOpen"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md max-h-40 overflow-auto"
      >
        <li
          v-for="option in priorityOptions"
          :key="option.value"
          @click="selectPriority(option.value)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-100 transition"
        >
          <span
            :class="[
              'block',
              option.value === form.priority
                ? 'font-semibold text-green-700'
                : 'font-normal text-gray-800',
            ]"
          >
            {{ option.label }}
          </span>
        </li>
      </ul>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <UButton
        type="button"
        variant="ghost"
        @click="onCancel"
        class="px-4 py-2"
      >
        Отмена
      </UButton>
      <UButton type="submit" color="success" class="px-4 py-2">
        Сохранить
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { Task } from "@/types/task";
import { priorityMap } from "@/utils/priority";

const props = defineProps<{ initial?: Partial<Task> }>();

const emit = defineEmits<{
  (e: "save", data: any): void;
  (e: "cancel"): void;
}>();

const dropdownOpen = ref(false);

const priorityOptions = Object.entries(priorityMap).map(([value, data]) => ({
  value,
  label: data.label,
}));

const form = reactive({
  title: "",
  description: "",
  dueDate: new Date().toISOString().split("T")[0],
  priority: "normal",
});

watch(
  () => props.initial,
  (val) => {
    if (!val) return;

    Object.assign(form, {
      title: "",
      description: "",
      priority: "normal",
      ...val,
      dueDate: val.dueDate
        ? val.dueDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
  },
  { immediate: true },
);

const priorityLabel = (value: string) => {
  return priorityOptions.find((o) => o.value === value)?.label || "Обычный";
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectPriority = (value: string) => {
  form.priority = value;
  dropdownOpen.value = false;
};

const onCancel = () => emit("cancel");

const submit = () => {
  if (!form.title || !form.dueDate) {
    alert("Заполните название и срок");
    return;
  }

  emit("save", {
    ...form,
    dueDate: form.dueDate || null,
  });
};
</script>
