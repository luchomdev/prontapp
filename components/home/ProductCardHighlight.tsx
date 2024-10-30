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

interface ProductCardHighlightProps {
  product: Product;
}

const ProductCardHighlight: React.FC<ProductCardHighlightProps> = ({ product }) => {
  const discount = product.price_fake_discount
    ? Math.round(((product.price_fake_discount - product.precio_final) / product.price_fake_discount) * 100)
    : 0;

  return (
    <div className="group relative bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-orange-500">
      {product.price_fake_discount && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        </div>
      )}
      <div className="absolute top-1.5 right-1.5 z-10">
        <div className="bg-black text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium">
          Hot Deal
        </div>
      </div>
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
          <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 hover:text-orange-500">
            {product.name}
          </h3>
        </Link>
        <div>
          {product.price_fake_discount && (
            <p className="text-xs text-gray-500 line-through">
              {formatCurrency(product.price_fake_discount)}
            </p>
          )}
          <p className="text-sm font-bold text-orange-500">
            {formatCurrency(product.precio_final)}
          </p>
        </div>
        <Link 
          href={`/product/${product.id}/${product.seo_slug}`}
          className="mt-1 inline-flex items-center text-xs font-medium text-orange-500 hover:text-orange-600"
        >
          Ver detalles
          <FaChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCardHighlight;