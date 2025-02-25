'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SkeletonLogoHome from '@/components/skeletons/SkeletonLogoHome';
import { getLogoUrl } from '@/app/actions/logo';

const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const url = await getLogoUrl();
        //console.log('Logo URL from server action:', url);
        setLogoUrl(url);
      } catch (err) {
        setError('Error loading logo');
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : 'Unknown'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, []);

  if (isLoading) {
    return <SkeletonLogoHome />;
  }

  if (error || !logoUrl) {
    return <div className="text-red-500">{error || 'Logo not available'}</div>;
  }

  return (
    <Link href="/" className="relative w-[120px] h-[30px] sm:w-[200px] sm:h-[45px] md:w-[250px] md:h-[55px] transition-all duration-300">
      <Image
        src={logoUrl}
        alt="Prontapp productos de tendencia en colombia"
        fill
        sizes="(max-width: 640px) 120px, (max-width: 768px) 200px, 250px"
        style={{ objectFit: 'contain' }}
        priority
      />
    </Link>
  );
};

export default Logo;