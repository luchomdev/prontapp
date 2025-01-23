"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import ModalSetStar from '@/components/panel/ModalSetStar';

interface ProductItemProps {
  name: string;
  amount: number;
  price: number;
  imageUrl: string;
  productId: string;
  orderId: string;
  delivery_state: number;
  last_state: number | null
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  name, 
  amount, 
  price, 
  imageUrl, 
  productId, 
  orderId, 
  delivery_state, 
  last_state 
}) => {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const canRate = delivery_state === 4 && last_state === 17;

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center">
        <div className="relative w-20 h-20 mr-4">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 80px, 100px"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-600">Cantidad: {amount}</p>
          <p className="text-gray-600">Subtotal: ${(price * amount).toLocaleString()}</p>
        </div>
      </div>
      {canRate && (
        <button 
          onClick={() => setShowRatingModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Calificar Producto
        </button>
      )}
      {showRatingModal && (
        <ModalSetStar
          productId={productId}
          orderId={orderId}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

interface OrderProductsProps {
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
  last_state: number | null
}

const OrderProducts: React.FC<OrderProductsProps> = ({ stocks, total_shipping_cost, orderId, delivery_state, last_state }) => {
  const totalOrder = Object.values(stocks).reduce((sum, item) => sum + (item.price * item.amount), 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Productos de la Orden</h2>
      <div className="space-y-4">
        {Object.entries(stocks).map(([key, item]) => (
          <ProductItem
            key={key}
            name={item.name}
            amount={item.amount}
            price={item.price}
            imageUrl={item.images[0]?.url || '/placeholder-image.jpg'}
            productId={item.id}
            orderId={orderId}
            delivery_state={delivery_state}
            last_state={last_state}
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

export default OrderProducts;