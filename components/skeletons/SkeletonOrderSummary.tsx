import React from 'react';

const SkeletonOrderSummary: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center mb-2">
            <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        {[1, 2].map((item) => (
          <div key={item} className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonOrderSummary;