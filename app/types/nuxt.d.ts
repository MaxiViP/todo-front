import type { AxiosInstance } from "axios";

declare module "#app" {
  interface NuxtApp {
    $api: AxiosInstance;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $api: AxiosInstance;
  }
}
// types/nuxt.d.ts
/// <reference types="nuxt" />

declare module "@vue/runtime-core" {
  interface AppConfig {
    ui?: {
      colors?: {
        primary?: string;
        neutral?: string;
      };
    };
  }
}

declare module "#imports" {
  export const definePageMeta: (meta: Record<string, any>) => void;
  export function useDropdown(): {
    open: boolean;
    toggle: () => void;
    ref: any;
  };
}
