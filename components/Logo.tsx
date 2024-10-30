'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SkeletonLogoHome from '@/components/skeletons/SkeletonLogoHome';

const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        console.log('Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/logo/url`);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logo/url`);

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        if (!response.ok) {
          const errorData = await response.json().catch(e => ({ message: 'No error details available' }));
          console.error('Response error details:', errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        setLogoUrl(data.logoUrl);
      } catch (err) {
        setError('Error loading logo');
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : 'Unknown'
        });

        if (err instanceof TypeError) {
          console.error('Network error - possible CORS issue');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogoUrl();
  }, []);

  if (isLoading) {
    return <SkeletonLogoHome />;
  }

  if (error || !logoUrl) {
    return <div className="text-red-500">{error || 'Logo not available'}</div>;
  }

  return (
    <Link href="/" className="relative w-[200px] h-[40px] sm:w-[240px] sm:h-[50px] md:w-[290px] md:h-[60px] transition-all duration-300">
      <Image
        src={logoUrl}
        alt="Prontapp productos de tendencia en colombia"
        fill
        sizes="(max-width: 768px) 200px, (max-width: 1200px) 250px, 300px"
        style={{ objectFit: 'contain' }}
        priority
      />
    </Link>
  );
};

export default Logo;