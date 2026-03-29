import { computed } from "vue";

export const usePagination = (store: any) => {
  const totalPages = computed(() =>
    store.limit ? Math.ceil(store.total / store.limit) : 1,
  );

  const next = () => {
    if (store.page < totalPages.value) store.page++;
  };

  const prev = () => {
    if (store.page > 1) store.page--;
  };

  return { totalPages, next, prev };
};
