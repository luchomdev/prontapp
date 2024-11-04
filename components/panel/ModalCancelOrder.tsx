"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toaster from '@/components/Toaster';
import { cancelOrder } from '@/app/actions/orders';

interface ModalCancelOrderProps {
  order_id: number;
  onClose: () => void;
}

const ModalCancelOrder: React.FC<ModalCancelOrderProps> = ({ order_id, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const success = await cancelOrder(order_id);

      if (!success) {
        throw new Error('Failed to cancel order');
      }

      setToastMessage('Orden cancelada exitosamente');
      setToastType('success');
      
      setTimeout(() => {
        router.push('/panel/orders');
      }, 2000);
    } catch (error) {
      console.error('Error canceling order:', error);
      setToastMessage('Error al cancelar la orden');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg mx-2 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Cancelar Orden</h3>
        <p className="mb-6">¿Está seguro que desea cancelar la orden #{order_id}?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            {isLoading ? 'Cancelando...' : 'Confirmar'}
          </button>
        </div>
      </div>
      {toastMessage && (
        <Toaster
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ModalCancelOrder;