"use client"
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

interface OrderCardProps {
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
  };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const totalProducts = Object.values(order.stocks).reduce((sum, item) => sum + item.amount, 0);
  const totalOrder = Object.values(order.stocks).reduce((sum, item) => sum + (item.amount * item.price), 0);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg font-semibold">Orden #{order.order_id}</h3>
        <p className="text-sm text-gray-600">Estado: {order.delivery_state_description}</p>
        <p className="text-sm text-gray-600">Creada: {formatDate(order.created_at)}</p>
      </div>
      <div className="mb-4 md:mb-0">
        <h4 className="font-medium">Cliente:</h4>
        <p className="text-sm">{order.customer.name}</p>
        <p className="text-sm">{order.customer.email}</p>
      </div>
      <div className="mb-4 md:mb-0">
        <h4 className="font-medium">Resumen:</h4>
        <p className="text-sm">Cantidad de productos: {totalProducts}</p>
        <p className="text-sm">Total Orden: ${totalOrder.toLocaleString()}</p>
      </div>
      <Link href={`/panel/orders/${order.order_id}`}>
        <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
          <FaChevronRight />
        </button>
      </Link>
    </div>
  );
};

export default OrderCard;