"use client"
import { useStore } from '@/stores/cartStore';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItemList = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useStore((state) => ({
    cart: state.cart,
    increaseQuantity: state.increaseQuantity,
    decreaseQuantity: state.decreaseQuantity,
    removeFromCart: state.removeFromCart
  }));

  return (
    <div className="space-y-4">
      {Object.entries(cart).map(([stock_id, item]) => (
        <div key={stock_id} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow">
          <div className="w-24 h-24 relative mb-4 sm:mb-0 sm:mr-4">
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 32px, 48px"
              style={{ objectFit: 'cover' }}
              className='rounded'
            />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">Precio: ${item.precio.toFixed(0)}</p>
            <p className="text-gray-600">Subtotal: ${item.subtotal.toFixed(0)}</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <button
              onClick={() => decreaseQuantity(parseInt(stock_id))}
              className={`text-orange-500 hover:text-orange-600 p-1 ${item.cantidad <= item.minQuantity ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={item.cantidad <= item.minQuantity}
            >
              <FaMinus />
            </button>
            <span className="mx-2">{item.cantidad}</span>
            <button
              onClick={() => increaseQuantity(parseInt(stock_id))}
              className="text-orange-500 hover:text-orange-600 p-1"
            >
              <FaPlus />
            </button>
            <button
              onClick={() => removeFromCart(parseInt(stock_id))}
              className="ml-4 text-gray-200 hover:text-red-600 p-1"
              aria-label="Eliminar producto"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemList;