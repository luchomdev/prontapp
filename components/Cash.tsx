"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import SkeletonLoadingModal from '@/components/skeletons/SkeletonLoadingModal';
import Toaster from '@/components/Toaster';
import { getShippingQuote } from '@/app/actions/shipping';
import { createOrUpdateTmpOrderAct, processCashOrder } from '@/app/actions/payment';

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
  const hasRunEffect = useRef(false);

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
    totalCartValue,
    shippingQuote,
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
    totalCartValue: state.totalCartValue,
    shippingQuote: state.shippingQuote,
  }));

  const handleToggle = () => {
    onToggle();
    if (!isActive) {
      setPayment(0);
      hasRunEffect.current = false; // Reset the flag when toggling
    }
  };

  const fetchShippingQuote = useCallback(async () => {
    if (!shippingAddress) return;

    setIsLoadingQuote(true);
    try {
      const stock_ids = Object.keys(cart).map(Number);
      const data = await getShippingQuote(stock_ids, shippingAddress.city_id, 0);
      
      if (data?.status === 'success') {
        setShippingQuote(data.quotations);
        const totalShipping = data.quotations.reduce((sum: number, q) => sum + q.shipping_value, 0);
        setTotalShippingCost(totalShipping);
      }
    } catch (error) {
      console.error('Error fetching shipping quote:', error);
      setError('Error al calcular el costo de envío');
    } finally {
      setIsLoadingQuote(false);
    }
  }, [shippingAddress, cart, setShippingQuote, setTotalShippingCost]);

  const createOrUpdateTmpOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentState = useStore.getState();
      const data = await createOrUpdateTmpOrderAct({
        cart_content: currentState.cart,
        shipping_quote: currentState.shippingQuote,
        shipping_address: currentState.shippingAddress,
        subtotals_value: currentState.subtotalsValue,
        total_cart_value: currentState.totalCartValue,
        total_shipping_cost: currentState.totalShippingCost,
        customer: currentState.customerInfo,
        payment: "0", // Pago en efectivo
        auth_user_id: user.id,
        auth_user_email: user.email,
        order_tmp_id: currentState.tmp_order_id
      });
  
      if (data) {
        setTmpOrderId(data.id);
      }
    } catch (error) {
      console.error('Error creating or updating temporary order:', error);
      setError('Error al actualizar la orden temporal');
    } finally {
      setIsLoading(false);
    }
  }, [user, setTmpOrderId]);

  useEffect(() => {
    if (isActive && !hasRunEffect.current) {
      hasRunEffect.current = true;
      fetchShippingQuote();
    }
  }, [isActive, fetchShippingQuote]);

  useEffect(() => {
    if (isActive && shippingQuote.length > 0) {
      createOrUpdateTmpOrder();
    }
  }, [isActive, shippingQuote, createOrUpdateTmpOrder]);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      const data = await processCashOrder(tmp_order_id);
      
      if (data) {
        router.push(`/cash-confirmation?orderIds=${data.orderIds.join(',')}&totalValue=${totalCartValue}`);
      } else {
        throw new Error('Failed to create order');
      }
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