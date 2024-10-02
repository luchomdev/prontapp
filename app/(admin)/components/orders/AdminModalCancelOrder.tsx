import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toaster from '@/components/Toaster';

interface AdminModalCancelOrderProps {
  order_id: number;
  onClose: () => void;
}

const AdminModalCancelOrder: React.FC<AdminModalCancelOrderProps> = ({ order_id, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order_id}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setToastMessage('Orden cancelada exitosamente');
      setToastType('success');
      
      // Delay redirect to show the success message
      setTimeout(() => {
        router.push('/console/orders');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

export default AdminModalCancelOrder;