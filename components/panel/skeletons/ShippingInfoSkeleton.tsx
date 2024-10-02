import React from 'react';

const ShippingInfoSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default ShippingInfoSkeleton;