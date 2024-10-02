'use client';

import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import CashTransactionInfo from '@/components/CashTransactionInfo';
import BrandMessage from '@/components/BrandMessage';
import { useStore } from '@/stores/cartStore';

const CashConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const orderIds = searchParams.get('orderIds')?.split(',') || [];
  const totalValue = Number(searchParams.get('totalValue')) || 0;

  const resetState = useStore(state => ({
    clearCart: state.clearCart,
    setPayment: state.setPayment,
    resetShippingQuote: state.resetShippingQuote,
    setSubtotalsValue: state.setSubtotalsValue,
    setTmpOrderId: state.setTmpOrderId,
    setTotalShippingCost: state.setTotalShippingCost,
  }));

  useEffect(() => {
    resetState.clearCart();
    resetState.setPayment(0);
    resetState.resetShippingQuote();
    resetState.setSubtotalsValue(0);
    resetState.setTmpOrderId(null);
    resetState.setTotalShippingCost(0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-between">
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-700 text-3xl mr-2" />
            <h1 className="text-2xl font-bold">¡Gracias por su compra!</h1>
          </div>
          <CashTransactionInfo orderIds={orderIds} totalValue={totalValue} />
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:pl-8">
        <BrandMessage />
      </div>
    </div>
  );
};

export default CashConfirmationPage;