"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/cartStore';

export const useShippingAddress = () => {
  const router = useRouter();
  const { shippingAddress, isLoading, openSetAddressModal } = useStore((state) => ({
    shippingAddress: state.shippingAddress,
    isLoading: state.isLoading,
    openSetAddressModal: state.openSetAddressModal
  }));

  useEffect(() => {
    if (!isLoading && !shippingAddress) {
      router.push('/'); 
    }
  }, [shippingAddress, isLoading, router]);

  return { hasShippingAddress: !!shippingAddress, isLoading };
};