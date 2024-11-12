import React, { useState } from 'react';
import ModalCancelOrder from './ModalCancelOrder';

interface OrderInfoProps {
  order_id: number;
  delivery_state_description: string;
  created_at: string;
  payment: number;
  guide_id: number | null;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order_id, delivery_state_description, created_at, payment, guide_id }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Información del Pedido</h2>
      <div className="space-y-2">
        <p><strong>Número de Orden:</strong> {order_id}</p>
        <p><strong>Estado:</strong> {delivery_state_description}</p>
        <p><strong>Fecha de Creación:</strong> {formatDate(created_at)}</p>
        <p><strong>Método de Pago:</strong> {payment === 0 ? 'Contraentrega' : 'Pago Online'}</p>
      </div>
      <button 
        disabled={guide_id !== null || delivery_state_description==="Cancelada"} 
        onClick={() => setShowCancelModal(true)} 
        className={`mt-4 ${(guide_id !== null || delivery_state_description==="Cancelada") ? 'bg-gray-100 text-gray-300' : 'bg-red-500 text-white hover:bg-red-600'} px-4 py-2 rounded-md transition-colors`}
      >
        Cancelar órden
      </button>
      {showCancelModal && (
        <ModalCancelOrder 
          order_id={order_id} 
          onClose={() => setShowCancelModal(false)} 
        />
      )}
    </div>
  );
};

export default OrderInfo;