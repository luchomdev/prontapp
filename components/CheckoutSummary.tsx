    "use client"
import { useEffect, useState } from 'react';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import PaySecureText from '@/components/SecurePaymentText';
import SkeletonSummary from '@/components/skeletons/SkeletonSummary';
import { formatCurrency } from '@/lib/Helpers';
import { getShippingQuote } from '@/app/actions/shipping';

const CheckoutSummary = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { 
    cart, 
    totalCartValue, 
    subtotalsValue,
    shippingAddress, 
    totalItems, 
    setShippingQuote, 
    totalShippingCost,
    setTotalShippingCost
  } = useStore((state) => ({
    cart: state.cart,
    totalCartValue: state.totalCartValue,
    subtotalsValue: state.subtotalsValue,
    shippingAddress: state.shippingAddress,
    totalItems: state.totalItems,
    setShippingQuote: state.setShippingQuote,
    totalShippingCost: state.totalShippingCost,
    setTotalShippingCost: state.setTotalShippingCost
  }));

  useEffect(() => {
    const fetchShippingQuote = async () => {
      setIsLoading(true);
      const stock_ids = Object.keys(cart).map(Number);
      const city_to = shippingAddress?.city_id;

      if (!city_to) {
        console.error('No shipping address set');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getShippingQuote(stock_ids, city_to, 0);

        if (data && data.status === 'success') {
          setShippingQuote(data.quotations);
          const totalShipping = data.quotations.reduce(
            (sum: number, q: any) => sum + q.shipping_value, 
            0
          );
          setTotalShippingCost(totalShipping);
        } else {
          console.error('Failed to get shipping quote');
        }
      } catch (error) {
        console.error('Error fetching shipping quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingQuote();
  }, [cart, shippingAddress, setShippingQuote, setTotalShippingCost]);

  const handlePayment = () => {
    router.push('/payment');
  };

  const isPaymentEnabled = totalShippingCost > 0;

  if (isLoading) {
    return <SkeletonSummary />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
      <div className="mb-4">
        <p className="font-semibold">Subtotal en productos: {formatCurrency(subtotalsValue)}</p>
        <p className="text-sm text-gray-600">Cantidad de items: {totalItems}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Dirección de envío:</p>
        {shippingAddress && (
          <div>
            <p>{shippingAddress.cityName}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.addressComplement}</p>
          </div>
        )}
        <p className="mt-2">Costo de envío: {formatCurrency(totalShippingCost)}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Total a pagar: {formatCurrency(totalCartValue)}</p>
      </div>
      <button
        onClick={handlePayment}
        disabled={!isPaymentEnabled}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
      >
        Pagar
      </button>
      <PaySecureText />
    </div>
  );
};

export default CheckoutSummary;