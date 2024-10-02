"use client"
import { useStore } from '@/stores/cartStore';
import Image from 'next/image';

const CheckoutCartItemsList = () => {
  const { cart } = useStore((state) =>({
    cart: state.cart
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
            <p className="text-gray-600">Cantidad: {item.cantidad}</p>
            <p className="text-gray-600">Subtotal: ${item.subtotal.toFixed(0)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckoutCartItemsList;