import { useEffect, useState } from 'react';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useHydration } from './useHydration';

export const useCheckoutPage = () => {
  const hydrated = useHydration();
  const [isReady, setIsReady] = useState(false);
  const { shippingAddress } = useStore((state) => ({
    shippingAddress: state.shippingAddress,
  }));
  const router = useRouter();

  useEffect(() => {
    if (hydrated) {
      if (!shippingAddress) {
        console.log('No shipping address, redirecting to cart');
        router.push('/cart');
      } else {
        console.log('Shipping address found, setting isReady to true');
        setIsReady(true);
      }
    }
  }, [hydrated, shippingAddress, router]);

  return {
    isLoading: !hydrated || !isReady,
    hasShippingAddress: !!shippingAddress,
  };
};