"use client"
import { useStore } from '@/stores/cartStore';
import CartItemList from '@/components/CartItemList';
import CartSummary from '@/components/CartSummary';
import CartSkeleton from '@/components/skeletons/CartSkeleton';
import { useShippingAddress } from '@/hooks/useShippingAddress';

const CartPage = () => {
  const { hasShippingAddress, isLoading } = useShippingAddress();
  const { cart, isAuthenticated } = useStore((state) => ({
    cart: state.cart,
    isAuthenticated: state.isAuthenticated
  }));

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (!hasShippingAddress) {
    return null; // El hook se encargará de la redirección
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>
      {Object.keys(cart).length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CartItemList />
          </div>
          <div className="lg:w-1/3">
            <CartSummary isAuthenticated={isAuthenticated} hasShippingAddress={hasShippingAddress} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;