import React from 'react';

const SkeletonPaymentContainer: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
      <div className="lg:w-2/3">
        {/* Skeleton para Cash payment method */}
        <div className="mb-6 border rounded-lg p-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Skeleton para EpaycoWithTc payment method */}
        <div className="mb-6 border rounded-lg p-4">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          
          {/* Skeleton para tarjetas guardadas */}
          <div className="mt-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
          </div>
          
          {/* Skeleton para nuevo formulario de tarjeta */}
          <div className="mt-4">
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="flex space-x-4 mb-2">
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
          </div>
        </div>
      </div>

      {/* Skeleton para OrderSummary */}
      <div className="lg:w-1/3">
        <div className="border rounded-lg p-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPaymentContainer;