"use client"
import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import MiniCartProduct from '@/components/MiniCartProduct';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/Helpers';

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { cart, removeFromCart, subtotalsValue, isAuthenticated, shippingAddress, totalItems } = useStore(state => ({
    cart: state.cart,
    removeFromCart: state.removeFromCart,
    subtotalsValue: state.subtotalsValue,
    isAuthenticated: state.isAuthenticated,
    shippingAddress: state.shippingAddress,
    totalItems: state.totalItems
  }));

  const isActionEnabled = isAuthenticated && !!shippingAddress && totalItems > 0;

  if (!isOpen) return null;

  const handleViewCart = () => {
    if (isActionEnabled) {
      router.push('/cart');
      onClose();
    }
  };

  const handleCheckout = () => {
    if (isActionEnabled) {
      router.push('/checkout');
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 md:w-80 lg:w-96 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tu Carrito</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {Object.entries(cart).map(([stock_id, item]) => (
          <MiniCartProduct 
            key={stock_id} 
            stock_id={Number(stock_id)} 
            item={item} 
            onRemove={removeFromCart} 
          />
        ))}
        {totalItems === 0 && (
          <p className="text-center text-gray-500 mt-4">Tu carrito está vacío</p>
        )}
      </div>
      <div className="p-4 border-t">
        <p className="text-right mb-2">Total: {formatCurrency(subtotalsValue)}</p>
        <button 
          className="w-full mb-2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleViewCart}
          disabled={!isActionEnabled}
        >
          Ver Carrito
        </button>
        <button 
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleCheckout}
          disabled={!isActionEnabled}
        >
          Finalizar Compra
        </button>
        {!isActionEnabled && (
          <p className="mt-2 text-sm text-red-500 text-center">
            {!isAuthenticated 
              ? 'Inicia sesión para continuar' 
              : !shippingAddress 
                ? 'Establece una dirección de envío'
                : totalItems === 0
                  ? 'Agrega productos al carrito'
                  : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;