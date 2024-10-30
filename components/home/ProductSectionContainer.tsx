 "use client"
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/home/ProductCard';
import ProductCardHighlight from '@/components/home/ProductCardHighlight';

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

interface ProductSectionContainerProps {
  title: string;
  viewAllLink: string;
  products: Product[];
  isHighlight?: boolean;
}

const ProductSectionContainer: React.FC<ProductSectionContainerProps> = ({
  title,
  viewAllLink,
  products,
  isHighlight = false
}) => {
  return (
    <section className="container w-full mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <Link 
          href={viewAllLink}
          className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium transition-colors duration-200"
        >
          Ver todos
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          isHighlight ? (
            <ProductCardHighlight key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        ))}
      </div>
    </section>
  );
};

export default ProductSectionContainer;