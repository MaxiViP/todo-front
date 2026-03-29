import type { TaskPriority } from "@/types/task";

export const priorityMap: Record<
  TaskPriority,
  { label: string; icon: string; class: string }
> = {
  low: {
    label: "Низкий",
    icon: "🔽",
    class: "bg-green-100 text-green-800",
  },
  normal: {
    label: "Обычный",
    icon: "➡️",
    class: "bg-gray-100 text-gray-800",
  },
  high: {
    label: "Высокий",
    icon: "🔺",
    class: "bg-red-100 text-red-800",
  },
};
