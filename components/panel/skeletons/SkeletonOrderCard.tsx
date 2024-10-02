import React from 'react';

const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-center animate-pulse">
      <div className="mb-4 md:mb-0 w-full md:w-1/4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="mb-4 md:mb-0 w-full md:w-1/4">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mb-4 md:mb-0 w-full md:w-1/4">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  );
};

export default OrderCardSkeleton;