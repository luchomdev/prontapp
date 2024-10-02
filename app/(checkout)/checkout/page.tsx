"use client"
import { useStore } from '@/stores/cartStore';
import CheckoutCartItemsList from '@/components/CheckoutCartItemsList';
import CheckoutSummary from '@/components/CheckoutSummary';
import CheckoutSkeleton from '@/components/skeletons/CheckoutSkeleton';
import { useCheckoutPage } from '@/hooks/useCheckoutPage';

const CheckoutPage = () => {
  const { isLoading, hasShippingAddress } = useCheckoutPage();
  const { cart } = useStore((state) => ({
    cart: state.cart,
  }));

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!hasShippingAddress) {
    return null; // El hook se encargará de la redirección
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      {Object.keys(cart).length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CheckoutCartItemsList />
          </div>
          <div className="lg:w-1/3">
            <CheckoutSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;