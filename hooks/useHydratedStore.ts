// hooks/useHydratedStore.ts
import { useStore } from "@/stores/cartStore";
import { useHydration } from "./useHydration";

export function useHydratedStore<T>(selector: (state: ReturnType<typeof useStore>) => T): T {
  const hydrated = useHydration();
  const result = useStore(selector);

  if (!hydrated) {
    // Retorna un objeto vacío o un valor por defecto apropiado
    return {} as T;
  }

  return result;
}