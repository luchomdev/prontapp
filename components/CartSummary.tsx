"use client"

import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/Helpers';

interface CartSummaryProps {
  isAuthenticated: boolean;
  hasShippingAddress: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ isAuthenticated, hasShippingAddress }) => {
  const {openSetAddressModal} = useStore((state) =>({
    openSetAddressModal: state.openSetAddressModal
  }));
  const { subtotalsValue, shippingAddress, totalItems } = useStore((state) =>({
    subtotalsValue:state.subtotalsValue,
    shippingAddress:state.shippingAddress,
    totalItems: state.totalItems
  }));
  const router = useRouter();

  const handleCheckout = () => {
    if (isAuthenticated && hasShippingAddress) {
      router.push('/checkout');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Resumen del Carrito</h2>
      <div className="mb-4">
        <p className="font-semibold">Subtotal en productos: {formatCurrency(subtotalsValue)}</p>
        <p className="text-sm text-gray-600">Cantidad de items: {totalItems}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Dirección de envío:</p>
        {shippingAddress ? (
          <div>
            <p>{shippingAddress.cityName}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.addressComplement}</p>
          </div>
        ) : (
          <p className="text-red-500">No se ha establecido una dirección de envío</p>
        )}
        <button
          onClick={openSetAddressModal}
          className="mt-2 text-orange-500 hover:text-orange-600"
        >
          {shippingAddress ? 'Cambiar dirección' : 'Establecer dirección'}
        </button>
      </div>
      <button
        onClick={handleCheckout}
        disabled={!isAuthenticated || !hasShippingAddress}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Finalizar Compra
      </button>
      {(!isAuthenticated || !hasShippingAddress) && (
        <p className="mt-2 text-sm text-red-500">
          {!isAuthenticated
            ? 'Debes iniciar sesión para finalizar la compra'
            : 'Debes establecer una dirección de envío'}
        </p>
      )}
    </div>
  );
};

export default CartSummary;