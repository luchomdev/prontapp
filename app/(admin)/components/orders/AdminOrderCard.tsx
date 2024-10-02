"use client"
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

interface AdminOrderCardProps {
  order: {
    order_id: number;
    delivery_state_description: string;
    customer: {
      name: string;
      email: string;
    };
    stocks: {
      [key: string]: {
        amount: number;
        price: number;
      }
    };
    created_at: string;
    payment: 0 | 1;
  };
}

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order }) => {
  const totalProducts = Object.values(order.stocks).reduce((sum, item) => sum + item.amount, 0);
  const totalOrder = Object.values(order.stocks).reduce((sum, item) => sum + (item.amount * item.price), 0);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getPaymentMethodText = (payment: 0 | 1): string => {
    return payment === 0 ? 'Contraentrega' : 'Pago Online';
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
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0 flex-grow">
        <h3 className="text-sm font-semibold">Orden #{order.order_id}</h3>
        <p className="text-xs text-gray-600">
          Estado:{' '}
          <span className={`${getStatusColor(order.delivery_state_description)} px-2 py-1 rounded`}>
            {order.delivery_state_description}
          </span>
        </p>
        <p className="text-xs text-gray-600">Creada: {formatDate(order.created_at)}</p>
        <p className="text-xs text-gray-600">Método de pago: {getPaymentMethodText(order.payment)}</p>
      </div>
      <div className="mb-4 md:mb-0 flex-grow">
        <h4 className="text-sm font-medium">Cliente:</h4>
        <p className="text-xs">{order.customer.name}</p>
        <p className="text-xs">{order.customer.email}</p>
      </div>
      <div className="mb-4 md:mb-0 flex-grow">
        <h4 className="text-sm font-medium">Resumen:</h4>
        <p className="text-xs">Cantidad de productos: {totalProducts}</p>
        <p className="text-xs">Total Orden: ${totalOrder.toLocaleString()}</p>
      </div>
      <Link href={`/console/orders/${order.order_id}`}>
        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
          <FaChevronRight />
        </button>
      </Link>
    </div>
  );
};

export default AdminOrderCard;