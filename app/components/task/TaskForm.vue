<template>
  <form @submit.prevent="submit">
    <AppInput v-model="form.title" placeholder="Название" />
    <AppInput v-model="form.description" placeholder="Описание" />
    <AppInput type="date" v-model="form.dueDate" />

    <label>
      <input type="checkbox" v-model="form.isCompleted" />
      Выполнено
    </label>

    <AppButton>Сохранить</AppButton>
  </form>
</template>

<script setup>
const props = defineProps({
  initial: Object,
})

const emit = defineEmits(['save'])

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  isCompleted: false,
})

onMounted(() => {
  if (props.initial) Object.assign(form, props.initial)
})

const submit = () => {
  if (!form.title || !form.dueDate) {
    alert('Заполни обязательные поля')
    return
  }

  emit('save', form)
}
</script>
