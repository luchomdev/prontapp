"use client"
import React from 'react';
import RecentlyViewedProductCard from './RecentlyViewedProductCard';
import { useStore } from '@/stores/cartStore';

const RecentlyViewed: React.FC = () => {
  const recentlyViewedProducts = useStore((state) => state.recentlyViewedProducts);

  const products = Object.values(recentlyViewedProducts);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="my-8 ">
      <h2 className="text-xl font-bold mb-4">Productos vistos recientemente</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <RecentlyViewedProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            thumbnail={product.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;