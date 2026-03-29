export type TaskPriority = "low" | "normal" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  isCompleted: boolean;
  priority: TaskPriority;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
