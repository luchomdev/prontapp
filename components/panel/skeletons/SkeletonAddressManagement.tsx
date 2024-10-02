import React from 'react';

const AddressManagementSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Skeleton for PageTitle */}
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>

      {/* Skeleton for Add Address button */}
      <div className="h-10 bg-gray-200 rounded w-48 mb-6"></div>

      {/* Skeleton for AddressList */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManagementSkeleton;