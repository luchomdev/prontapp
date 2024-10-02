"use client"
import React, { useState } from 'react';

interface ProductItemProps {
  name: string;
  amount: number;
  price: number;
  imageUrl: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  name, 
  amount, 
  price, 
  imageUrl
}) => {

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center">
        <img src={imageUrl} alt={name} className="w-20 h-20 object-cover mr-4" />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-600">Cantidad: {amount}</p>
          <p className="text-gray-600">Subtotal: ${(price * amount).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

interface AdminOrderProductsProps {
  stocks: {
    [key: string]: {
      id: string;
      price: number;
      amount: number;
      name: string;
      images: Array<{ url: string }>;
    };
  };
  total_shipping_cost: string | null;
  orderId: string;
  delivery_state: number;
  last_state: number | null;
}

const AdminOrderProducts: React.FC<AdminOrderProductsProps> = ({ stocks, total_shipping_cost, orderId, delivery_state, last_state }) => {
  
  const totalOrder = Object.values(stocks).reduce((sum, item) => sum + (item.price * item.amount), 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-md font-semibold mb-4">Productos de la órden</h2>
      <div className="space-y-4">
        {Object.entries(stocks).map(([key, item]) => (
          <ProductItem
            key={key}
            name={item.name}
            amount={item.amount}
            price={item.price}
            imageUrl={item.images[0]?.url || '/placeholder-image.jpg'}
          />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-right"><strong>Valor de Envío:</strong> ${Number(total_shipping_cost || 0).toLocaleString()}</p>
        <p className="text-right text-xl font-semibold">
          <strong>Total de la Orden:</strong> ${(totalOrder + (Number(total_shipping_cost) || 0)).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AdminOrderProducts;