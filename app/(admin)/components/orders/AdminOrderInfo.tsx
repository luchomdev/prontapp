import React, { useState } from 'react';
import AdminModalCancelOrder from '@/app/(admin)/components/orders/AdminModalCancelOrder';

interface AdminOrderInfoProps {
  order_id: number;
  delivery_state_description: string;
  created_at: string;
  payment: number;
  guide_id: number | null;
}

const AdminOrderInfo: React.FC<AdminOrderInfoProps> = ({ order_id, delivery_state_description, created_at, payment, guide_id }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'creada':
      case 'en proceso':
      case 'despachada':
      case 'en novedad':
        return 'bg-orange-100';
      case 'finalizada':
        return 'bg-green-100';
      case 'cancelada':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-md font-semibold mb-4">Información del Pedido</h2>
      <div className="space-y-2">
        <p><strong>Número de Orden:</strong> {order_id}</p>
        <p>
          <strong>Estado:</strong>{' '}
          <span className={`${getStatusColor(delivery_state_description)} px-2 py-1 rounded`}>
            {delivery_state_description}
          </span>
        </p>
        <p><strong>Fecha de Creación:</strong> {formatDate(created_at)}</p>
        <p><strong>Método de Pago:</strong> {payment === 0 ? 'Contraentrega' : 'Pago Online'}</p>
      </div>
      <button 
        disabled={guide_id !== null} 
        onClick={() => setShowCancelModal(true)} 
        className={`mt-4 ${guide_id !== null ? 'bg-gray-100 text-gray-300' : 'bg-red-500 text-white hover:bg-red-600'} px-4 py-2 rounded-md transition-colors`}
      >
        Cancelar orden
      </button>
      {showCancelModal && (
        <AdminModalCancelOrder 
          order_id={order_id} 
          onClose={() => setShowCancelModal(false)} 
        />
      )}
    </div>
  );
};

export default AdminOrderInfo;