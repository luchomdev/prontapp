"use client"
import { useStore } from '@/stores/cartStore';
import CartItemList from '@/components/CartItemList';
import CartSummary from '@/components/CartSummary';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const { cart, isLoading } = useStore((state) => ({
    cart: state.cart,
    isLoading: state.isLoading
  }));

  const EmptyCart = () => (
    <div className="text-center py-16">
      <div className="flex justify-center mb-6">
        <FaShoppingCart className="text-gray-300 w-24 h-24" />
      </div>
      <p className="text-gray-500 text-xl mb-8">Tu carrito está vacío</p>
      <Link 
        href="/" 
        className="inline-block bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
      >
        Empezar a comprar
      </Link>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Skeleton para los items del carrito */}
          {[1, 2].map((item) => (
            <div key={item} className="mb-6 bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3">
          {/* Skeleton para el resumen del carrito */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="mt-6">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    return Object.keys(cart).length === 0 ? (
      <EmptyCart />
    ) : (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <CartItemList />
        </div>
        <div className="lg:w-1/3">
          <CartSummary />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>
      {renderContent()}
    </div>
  );
};

export default CartPage;