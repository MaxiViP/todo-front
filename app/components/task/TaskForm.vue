<!-- TaskForm.vue -->
<template>
  <form class="space-y-4" @submit.prevent="submit">
    <UInput v-model="form.title" label="Название" required />
    <UTextarea v-model="form.description" label="Описание" :rows="3" />
    <UInput
      v-model="form.dueDate"
      type="date"
      label="Срок выполнения"
      required
    />

    <UCheckbox v-model="form.isCompleted" label="Задача выполнена" />

    <div class="flex justify-end gap-3">
      <UButton type="button" variant="ghost" @click="$emit('cancel')">
        Отмена
      </UButton>
      <UButton type="submit" color="green"> Сохранить </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps({ initial: Object });
const emit = defineEmits(["save", "cancel"]);

const form = reactive({
  title: "",
  description: "",
  dueDate: "",
  isCompleted: false,
});

if (props.initial) {
  Object.assign(form, props.initial);
}

const submit = () => {
  if (!form.title || !form.dueDate) {
    alert("Заполните название и срок"); // потом замени на toast
    return;
  }
  emit("save", { ...form });
};
</script>
