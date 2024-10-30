import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/Helpers';

interface RecentlyViewedProductCardProps {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
}

const RecentlyViewedProductCard: React.FC<RecentlyViewedProductCardProps> = ({ id, name, price, thumbnail }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-2 flex flex-col items-center max-w-[200px] w-full">
      <Link href={`/product/${id}`} className="w-full">
        <div className="relative w-full aspect-square mb-2" style={{ maxWidth: '120px', margin: '0 auto' }}>
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="120px"
            style={{ objectFit: 'cover' }}
            className="rounded-md"
          />
        </div>
      </Link>
      <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 text-center w-full">
        {name}
      </h3>
      <p className="text-sm font-bold text-gray-900">{formatCurrency(price)}</p>
    </div>
  );
};

export default RecentlyViewedProductCard;