import React from 'react';

const OrderInfoSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4 h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default OrderInfoSkeleton;