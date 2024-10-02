import React from 'react';

const ProductItemSkeleton: React.FC = () => (
  <div className="flex items-center justify-between border-b py-4 animate-pulse">
    <div className="flex items-center">
      <div className="w-20 h-20 bg-gray-200 rounded mr-4"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="h-10 bg-gray-200 rounded w-32"></div>
  </div>
);

const OrderProductsSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-4">
        <ProductItemSkeleton />
        <ProductItemSkeleton />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 ml-auto"></div>
      </div>
    </div>
  );
};

export default OrderProductsSkeleton;