import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

export const useDropdown = () => {
  const isOpen = ref(false);
  const refEl = ref();

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  onClickOutside(refEl, close);

  return {
    isOpen,
    refEl,
    toggle,
    close,
  };
};
