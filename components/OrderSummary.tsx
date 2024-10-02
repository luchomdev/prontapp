import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import SkeletonOrderSummary from './skeletons/SkeletonOrderSummary';

interface OrderSummaryProps {
  customerInfo: {
    name: string;
    email: string;
    identification: string;
    phone: string;
  } | null;
  subtotal: number;
  shippingCost: number;
}

const OrderSummary: React.FC = () => {
  const {customerInfo, subtotalsValue, totalCartValue, totalShippingCost, isLoading} = useStore((state) => ({
    customerInfo:state.customerInfo,
    subtotalsValue:state.subtotalsValue,
    totalCartValue: state.totalCartValue,
    totalShippingCost:state.totalShippingCost,
    isLoading:state.isLoading
  }))
  
  if(isLoading){
    return (<SkeletonOrderSummary />)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Resumen de la Compra</h3>
      
      {true && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Información del Cliente</h4>
          <div className="flex items-center mb-2">
            <FaUser className="mr-2 text-gray-500" />
            <span>{customerInfo?.name}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaIdCard className="mr-2 text-gray-500" />
            <span>{customerInfo?.identification}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2 text-gray-500" />
            <span>{customerInfo?.email}</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="mr-2 text-gray-500" />
            <span>{customerInfo?.phone}</span>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotalsValue.toFixed(0)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Costo de envío</span>
          <span>${totalShippingCost.toFixed(0)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span className="text-orange-500">${totalCartValue.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;