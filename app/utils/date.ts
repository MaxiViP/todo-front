export const formatDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ru-RU");
};
