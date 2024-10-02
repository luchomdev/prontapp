// Helper para obtener el usuario actual en el cliente
import { useStore } from "@/stores/cartStore";

export function useCurrentUser() {
    const { user } = useStore((state) =>({
      user: state.user
    }));
    return user;
  }

  // Helper para componentes del cliente
export function useIsAuthenticated() {
    const { isAuthenticated } = useStore((state) =>({
        isAuthenticated: state.isAuthenticated
      }));
  return isAuthenticated;
}