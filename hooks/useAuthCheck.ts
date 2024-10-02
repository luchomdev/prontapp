"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthCheck = (requiredParams: string[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const missingParams = requiredParams.filter(param => !searchParams.get(param));
    if (missingParams.length > 0) {
      router.push('/request-password-recovery');
    }
  }, [router, searchParams, requiredParams]);
};