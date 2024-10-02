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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logo/url`);
        if (!response.ok) {
          throw new Error('Failed to fetch logo URL');
        }
        const data = await response.json();
        setLogoUrl(data.logoUrl);
      } catch (err) {
        setError('Error loading logo');
        console.error('Error fetching logo URL:', err);
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