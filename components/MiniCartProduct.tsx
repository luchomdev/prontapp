import React from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { formatCurrency } from '@/lib/Helpers';

interface MiniCartProductProps {
  stock_id: number;
  item: {
    name: string;
    cantidad: number;
    precio: number;
    thumbnail: string;
    subtotal: number;
  };
  onRemove: (stock_id: number) => void;
}

const MiniCartProduct: React.FC<MiniCartProductProps> = ({ stock_id, item, onRemove }) => (
  <div className="flex items-center p-2 border-b">
    <div className="relative w-12 h-12 mr-2">
      <Image
        src={item.thumbnail}
        alt={item.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        className="rounded-md"
      />
    </div>
    <div className="flex-grow">
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-xs text-gray-600">
        {item.cantidad} x {formatCurrency(Number(item.precio.toFixed(0)))} = {formatCurrency(Number(item.subtotal.toFixed(0)))}
      </p>
    </div>
    <button 
      onClick={() => onRemove(stock_id)} 
      className="text-red-500 hover:text-red-700 ml-2"
      aria-label="Eliminar producto"
    >
      <FaTrash />
    </button>
  </div>
);

export default MiniCartProduct;