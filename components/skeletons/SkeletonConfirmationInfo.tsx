import React from 'react';

const SkeletonConfirmationInfo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-between">
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-3 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 h-10 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:pl-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-6 animate-pulse"></div>
          <div className="flex justify-center">
            <div className="h-10 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonConfirmationInfo;