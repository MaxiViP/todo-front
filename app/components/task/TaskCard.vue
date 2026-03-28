<button
  v-if="canEdit(task)"
  @click="edit(task)"
>
  ✏️
</button>

<button
  v-if="canEdit(task)"
  @click="deleteTask(task.id)"
>
  🗑
</button>
