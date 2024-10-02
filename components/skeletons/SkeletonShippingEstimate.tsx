import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const SkeletonShippingEstimate: React.FC = () => {
  return (
    <div className="bg-yellow-50 p-3 rounded-md mb-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaInfoCircle className="text-yellow-500 mr-2" />
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-4"></div>
      </div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  );
};

export default SkeletonShippingEstimate;