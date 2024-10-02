import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import SkeletonLoadingModal from '@/components/skeletons/SkeletonLoadingModal';
import Toaster from '@/components/Toaster';

interface AuthUser {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    identification: string | null;
    defaultAddress: {
        cityId: number;
        address: string;
        phone: string;
    } | null;
}

interface CashProps {
    user: AuthUser,
    isActive: boolean;
    onToggle: () => void;
}

const Cash: React.FC<CashProps> = ({ isActive, onToggle, user }) => {
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setPayment,
    shippingAddress,
    cart,
    setShippingQuote,
    setTotalShippingCost,
    subtotalsValue,
    tmp_order_id,
    setTmpOrderId,
    customerInfo,
    totalCartValue
  } = useStore(state => ({
    setPayment: state.setPayment,
    shippingAddress: state.shippingAddress,
    cart: state.cart,
    setShippingQuote: state.setShippingQuote,
    setTotalShippingCost: state.setTotalShippingCost,
    subtotalsValue: state.subtotalsValue,
    tmp_order_id: state.tmp_order_id,
    setTmpOrderId: state.setTmpOrderId,
    customerInfo: state.customerInfo,
    totalCartValue:state.totalCartValue
  }));

  const handleToggle = () => {
    onToggle();
    if (!isActive) {
      setPayment(0);
    }
  };

  const fetchShippingQuote = async () => {
    if (!shippingAddress) return;

    setIsLoadingQuote(true);
    const stock_ids = Object.keys(cart).map(Number);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_ids, city_to: shippingAddress.city_id, payment: 0 }),
      });

      if (!response.ok) throw new Error('Failed to fetch shipping quote');

      const data = await response.json();
      if (data.status === 'success') {
        setShippingQuote(data.quotations);
        const totalShipping = data.quotations.reduce((sum: number, q: any) => sum + q.shipping_value, 0);
        setTotalShippingCost(totalShipping);
      }
    } catch (error) {
      console.error('Error fetching shipping quote:', error);
      setError('Error al calcular el costo de envío');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const createOrUpdateTmpOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/tmp-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_content: cart,
          shipping_quote: await useStore.getState().shippingQuote,
          shipping_address: shippingAddress,
          subtotals_value: subtotalsValue,
          total_cart_value: await useStore.getState().totalCartValue,
          total_shipping_cost: await useStore.getState().totalShippingCost,
          customer: customerInfo,
          payment: "0",
          auth_user_id: user.id,
          auth_user_email: user.email,
          order_tmp_id: tmp_order_id
        }),
      });

      if (!response.ok) throw new Error('Failed to create or update temporary order');

      const data = await response.json();
      setTmpOrderId(data.id);
    } catch (error) {
      console.error('Error creating or updating temporary order:', error);
      setError('Error al actualizar la orden temporal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchShippingQuote().then(createOrUpdateTmpOrder);
    }
  }, [isActive]);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/cash-create`, {
        method: 'POST',
        credentials:'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmp_order_id }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const data = await response.json();
      router.push(`/cash-confirmation?orderIds=${data.orderIds.join(',')}&totalValue=${totalCartValue}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Error al crear la orden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 border rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <FaMoneyBillWave className="text-2xl mr-2 text-orange-500" />
          <h2 className="text-xl font-semibold">Contraentrega</h2>
        </div>
        {isActive ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isActive && (
        <div className="mt-4">
          <p className="mb-4">
            Al seleccionar pago contraentrega, usted se compromete a recibir y pagar por el pedido cuando sea entregado en la dirección especificada. El pago se realizará en efectivo al momento de la entrega.
          </p>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="acceptTerms">Acepto y entiendo el proceso de pago contraentrega</label>
          </div>
          <button
            onClick={handleCreateOrder}
            disabled={!isAccepted || isLoading || isLoadingQuote}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Realizar Pedido
          </button>
        </div>
      )}
      {(isLoading || isLoadingQuote) && <SkeletonLoadingModal />}
      {error && (
        <Toaster
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default Cash;