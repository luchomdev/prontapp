import React from 'react';

const AccountPageSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 w-1/4 mb-8 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BasicInformation skeleton */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-10 bg-gray-200 w-1/4 rounded"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-4 bg-gray-200 w-1/4 mb-2 rounded"></div>
              <div className="h-8 bg-gray-200 w-full rounded"></div>
            </div>
          ))}
        </div>

        {/* ChangePasswordSection skeleton */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-4 bg-gray-200 w-1/3 mb-2 rounded"></div>
              <div className="h-6 bg-gray-200 w-2/3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPageSkeleton;