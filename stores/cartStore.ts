// Store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Address {
  id: string;
  city_id: number;
  cityName: string;
  address: string;
  addressComplement: string;
  phone: string;
  default_address?: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  identification: string;
  defaultAddress: string | null;
}

// Tipos
interface CartItem {
  name: string;
  cantidad: number;
  precio: number;
  thumbnail: string;
  subtotal: number;
  minQuantity: number;
  measures: {
    [key: string]: string;
  };
}

interface ShippingAddress {
  city_id: number;
  cityName: string;
  address: string;
  addressComplement: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  identification: string;
  phone: string;
  address: string;
  city_id: string;
}

interface ShippingQuoteItem {
  stock_ids: number[];
  shipping_value: number;
  courier_id: number;
  courier_name: string;
}

interface StoreState {
  isLoading: boolean;
  cart: {
    [stock_id: number]: CartItem;
  };
  recentlyViewedProducts: {
    [id: string]: RecentlyViewedProduct;
  };
  subtotalsValue: number;
  totalCartValue: number;
  shippingAddress: ShippingAddress | null;
  customerInfo: CustomerInfo | null;
  shippingQuote: ShippingQuoteItem[];
  totalShippingCost: number;
  ePaycoToken: string | null;
  isLocationModalOpen: boolean;
  isSetAddressModalOpen: boolean;
  totalItems: number;
  isAuthenticated: boolean;
  user: AuthUser | null;
  payment: 0 | 1;
  tmp_order_id: string | null;
  addresses: Address[];
  isSidebarCollapsed: boolean;
  productsToGroup: string[];
}

interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  stock_id: number;
  thumbnail: string;
}

interface StoreActions {
  setLoading: (isLoading: boolean) => void;
  addToCart: (stock_id: number, item: CartItem) => void;
  removeFromCart: (stock_id: number) => void;
  increaseQuantity: (stock_id: number) => void;
  decreaseQuantity: (stock_id: number) => void;
  clearCart: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  resetShippingAddress: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  resetCustomerInfo: () => void;
  resetShippingQuote: () => void;
  setEPaycoToken: (token: string) => void;
  resetEPaycoToken: () => void;
  checkAndShowLocationModal: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  openSetAddressModal: () => void;
  closeSetAddressModal: () => void;
  switchToSetAddressModal: () => void;
  addToRecentlyViewed: (product: RecentlyViewedProduct) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setShippingQuote: (quote: ShippingQuoteItem[]) => void;
  setTotalShippingCost: (cost: number) => void;
  setSubtotalsValue: (value: number) => void;
  setPayment: (payment: 0 | 1) => void;
  setTmpOrderId: (id: string | null) => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setAddresses: (addresses: Address[]) => void;
  toggleSidebar: () => void;
  addProductsToGroups: (productId: string) => void;
  clearProductsToGroup: () => void;
}

const initialState: StoreState = {
  isLoading: true,
  cart: {},
  recentlyViewedProducts: {},
  subtotalsValue: 0,
  totalCartValue: 0,
  totalShippingCost: 0,
  shippingAddress: null,
  customerInfo: null,
  shippingQuote: [],
  ePaycoToken: null,
  isLocationModalOpen: false,
  isSetAddressModalOpen: false,
  totalItems: 0,
  isAuthenticated: false,
  user: null,
  payment: 0, // pago contraentrega por defecto
  tmp_order_id: null,
  addresses: [],
  isSidebarCollapsed: false,
  productsToGroup: [],
};

// Función auxiliar para calcular los totales del carrito
const calculateCartTotals = (cart: { [stock_id: number]: CartItem }) => {
  return Object.values(cart).reduce(
    (totals, item) => ({
      subtotalsValue: totals.subtotalsValue + item.subtotal,
      items: totals.items + item.cantidad,
    }),
    { subtotalsValue: 0, items: 0 }
  );
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLoading: (isLoading) => set({ isLoading }),
      addToCart: (stock_id: number, item: CartItem) => set((state) => {
        const newCart = { 
          ...state.cart, 
          [stock_id]: {
            ...item,
            cantidad: Math.max(item.cantidad, item.minQuantity) // Asegurarse de que la cantidad inicial no sea menor que la mínima
          }
        };
        const { subtotalsValue, items } = calculateCartTotals(newCart);
        return {
          cart: newCart,
          subtotalsValue,
          totalItems: items,
          totalCartValue: subtotalsValue + state.totalShippingCost,
        };
      }),
      removeFromCart: (stock_id) => set((state) => {
        const newCart = { ...state.cart };
        delete newCart[stock_id];
        const { subtotalsValue, items } = calculateCartTotals(newCart);
        return {
          cart: newCart,
          subtotalsValue,
          totalItems: items,
          totalCartValue: subtotalsValue + state.totalShippingCost,
        };
      }),
      increaseQuantity: (stock_id) => set((state) => {
        if (state.cart[stock_id]) {
          const newCart = {
            ...state.cart,
            [stock_id]: {
              ...state.cart[stock_id],
              cantidad: state.cart[stock_id].cantidad + 1,
              subtotal: (state.cart[stock_id].cantidad + 1) * state.cart[stock_id].precio,
            },
          };
          const { subtotalsValue, items } = calculateCartTotals(newCart);
          return {
            cart: newCart,
            subtotalsValue,
            totalItems: items,
            totalCartValue: subtotalsValue + state.totalShippingCost,
          };
        }
        return state;
      }),
      decreaseQuantity: (stock_id: number) => set((state) => {
        if (state.cart[stock_id] && state.cart[stock_id].cantidad > state.cart[stock_id].minQuantity) {
          const newCart = {
            ...state.cart,
            [stock_id]: {
              ...state.cart[stock_id],
              cantidad: state.cart[stock_id].cantidad - 1,
              subtotal: (state.cart[stock_id].cantidad - 1) * state.cart[stock_id].precio,
            },
          };
          const { subtotalsValue, items } = calculateCartTotals(newCart);
          return {
            cart: newCart,
            subtotalsValue,
            totalItems: items,
            totalCartValue: subtotalsValue + state.totalShippingCost,
          };
        }
        return state;
      }),
      clearCart: () => set({
        cart: {},
        subtotalsValue: 0,
        totalItems: 0,
        totalCartValue: 0,
        totalShippingCost: 0
      }),
      setShippingAddress: (address: ShippingAddress) => {
        set((state) => ({
          ...state,
          shippingAddress: address,
          isLocationModalOpen: false,
          isSetAddressModalOpen: false,
        }));
      },
      resetShippingAddress: () => set({ shippingAddress: null }),
      setCustomerInfo: (info) => set({ customerInfo: info }),
      resetCustomerInfo: () => set({ customerInfo: null }),
      resetShippingQuote: () => set({ shippingQuote: [], totalShippingCost: 0 }),
      setEPaycoToken: (token) => set({ ePaycoToken: token }),
      resetEPaycoToken: () => set({ ePaycoToken: null }),
      checkAndShowLocationModal: () => {
        const { shippingAddress, openLocationModal } = get();
        if (!shippingAddress) {
          openLocationModal();
        }
      },
      isLocationModalOpen: false,
      isSetAddressModalOpen: false,
      openLocationModal: () => set({ isLocationModalOpen: true, isSetAddressModalOpen: false }),
      closeLocationModal: () => set({ isLocationModalOpen: false }),
      openSetAddressModal: () => set({ isSetAddressModalOpen: true, isLocationModalOpen: false }),
      closeSetAddressModal: () => set({ isSetAddressModalOpen: false }),
      switchToSetAddressModal: () => set({ isLocationModalOpen: false, isSetAddressModalOpen: true }),
      addToRecentlyViewed: (product) => set((state) => {
        const newRecentlyViewed = { ...state.recentlyViewedProducts };
        delete newRecentlyViewed[product.id];
        const updatedRecentlyViewed = {
          [product.id]: product,
          ...newRecentlyViewed,
        };
        const limitedRecentlyViewed = Object.fromEntries(
          Object.entries(updatedRecentlyViewed).slice(0, 10)
        );
        return { recentlyViewedProducts: limitedRecentlyViewed };
      }),
      isAuthenticated: false,
      user: null,
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
      logout: () => set({
        isAuthenticated: false,
        user: null,
        shippingAddress: null,
        customerInfo: null,
        cart: {},
        subtotalsValue: 0,
        totalItems: 0,
        totalCartValue: 0,
        totalShippingCost: 0,
        shippingQuote: [],
        ePaycoToken: null,
        tmp_order_id: null,
      }),
      setShippingQuote: (quote) => set({ shippingQuote: quote }),
      setTotalShippingCost: (cost) => set((state) => ({
        totalShippingCost: cost,
        totalCartValue: state.subtotalsValue + cost,
      })),
      setSubtotalsValue: (value) => set((state) => ({
        subtotalsValue: value,
        totalCartValue: value + state.totalShippingCost
      })),
      setPayment: (payment) => set({ payment }),
      setTmpOrderId: (id) => set({ tmp_order_id: id }),
      addresses: [],
      addAddress: async (address) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/address`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              city_id: address.city_id,
              address: address.address,
              phone: address.phone,
            }),
          });
          if (!response.ok) throw new Error('Failed to add address');
          const newAddress = await response.json();
          set((state) => ({ addresses: [...state.addresses, newAddress] }));
        } catch (error) {
          console.error('Error adding address:', error);
          throw error;
        }
      },
      deleteAddress: async (id) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/address/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to delete address');
          set((state) => ({ addresses: state.addresses.filter(addr => addr.id !== id) }));
        } catch (error) {
          console.error('Error deleting address:', error);
          throw error;
        }
      },
      setAddresses: (addresses) => set({ addresses }),
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      productsToGroup: [],
      addProductsToGroups: (productId: string) => set((state) => {
        const updatedProductsToGroup = state.productsToGroup.includes(productId)
          ? state.productsToGroup.filter(id => id !== productId)
          : [...state.productsToGroup, productId];
        return { productsToGroup: updatedProductsToGroup };
      }),
      clearProductsToGroup: () => set({ productsToGroup: [] }),
    }),
    {
      name: 'prontapp-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...Object.fromEntries(
          Object.entries(state).filter(([key]) => !['isAuthenticated', 'user', 'isLoading'].includes(key))
        ),
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Estado hidratado:', state);
        return () => {
          state?.setLoading(false)
        }
      },
    }
  )
);