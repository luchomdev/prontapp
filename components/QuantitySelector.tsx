"use client"
import React, { useEffect } from 'react';
import { useStore } from '@/stores/cartStore';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  maxQuantity: number;
  minQuantity:number;
  stock_id: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity, maxQuantity,minQuantity, stock_id }) => {
  const {cartItem, isLoading } = useStore((state) => ({
    cartItem: state.cart[stock_id],
    isLoading: state.isLoading
  }));

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.cantidad || quantity);
    }
  }, [cartItem, setQuantity]);

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="quantity-selector" className="block text-sm font-medium text-gray-700 mb-2">
        Cantidad
      </label>
      <div className="flex items-center">
        <button
          onClick={handleDecrease}
          className="bg-gray-200 px-3 py-1 rounded-l"
          disabled={quantity === minQuantity}
        >
          -
        </button>
        {isLoading ? (<div>...</div>) : (<span id="quantity-selector" className="bg-gray-100 px-4 py-1">{quantity}</span>)}
        <button
          onClick={handleIncrease}
          className="bg-gray-200 px-3 py-1 rounded-r"
          disabled={quantity === maxQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;