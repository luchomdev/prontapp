"use client"
import { useState } from 'react';
import { useStore } from '@/stores/cartStore';
import { formatCurrency } from '@/lib/Helpers';
import CheckoutFlowModal from '@/components/CheckoutFlowModal';

const CartSummary = () => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { subtotalsValue, shippingAddress, totalItems } = useStore((state) => ({
    subtotalsValue: state.subtotalsValue,
    shippingAddress: state.shippingAddress,
    totalItems: state.totalItems
  }));

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Resumen del Carrito</h2>
        <div className="mb-4">
          <p className="font-semibold">Subtotal en productos: {formatCurrency(subtotalsValue)}</p>
          <p className="text-sm text-gray-600">Cantidad de items: {totalItems}</p>
        </div>
        {shippingAddress && (
          <div className="mb-4">
            <p className="font-semibold">Dirección de envío:</p>
            <div>
              <p>{shippingAddress.cityName}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.addressComplement}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCheckoutModalOpen(true)}
          className="w-full bg-orange-500 text-white py-2 font-bold rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={totalItems === 0}
        >
          Finalizar Compra
        </button>
      </div>

      <CheckoutFlowModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};

export default CartSummary;