"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import { formatCurrency } from '@/lib/Helpers';

interface Product {
  id: string;
  name: string;
  seo_slug: string;
  price_fake_discount: number | null;
  precio_final: number;
  images: Array<{
    url: string;
  }>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/product/${product.id}/${product.seo_slug}`}>
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 
                   (max-width: 768px) 33vw,
                   (max-width: 1024px) 25vw,
                   20vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-200"
            priority={false}
            quality={75}
          />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/product/${product.id}/${product.seo_slug}`}>
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 hover:text-orange-500">
            {product.name}
          </h3>
        </Link>
        <div>
          {product.price_fake_discount && (
            <p className="text-xs text-gray-500 line-through">
              {formatCurrency(product.price_fake_discount)}
            </p>
          )}
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(product.precio_final)}
          </p>
        </div>
        <Link 
          href={`/product/${product.id}/${product.seo_slug}`}
          className="absolute bottom-3 right-3 text-orange-500 hover:text-orange-600"
        >
          <FaChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;