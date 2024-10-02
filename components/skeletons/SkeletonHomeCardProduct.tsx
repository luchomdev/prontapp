import React from 'react';

const SkeletonHomeCardProduct: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-md p-2 flex flex-col max-w-[190px] animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="relative w-full aspect-square mb-2 md:mb-3 max-w-[150px] md:max-w-full mx-auto bg-gray-200 rounded"></div>
      <div className="flex justify-between items-center mb-1 md:mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex items-center mb-1 md:mb-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex flex-col space-y-1 md:space-y-2 mb-2 md:mb-3">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex space-x-1 overflow-x-auto">
        {[1, 2, 3].map((index) => (
          <div key={index} className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-md flex-shrink-0"></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonHomeCardProduct;