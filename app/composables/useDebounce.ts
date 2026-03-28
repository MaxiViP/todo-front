// useDebounce.ts;
import { debounce } from "lodash";

export const useDebounce = (fn: Function, delay = 500) => {
  return debounce(fn, delay);
};
