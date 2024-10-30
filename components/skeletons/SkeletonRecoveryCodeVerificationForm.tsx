import React from 'react';

const SkeletonRecoveryCodeVerificationForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>

      <div className="flex items-center space-x-2">
        <div className="flex-grow h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
      </div>

      <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>

      <div className="h-16 bg-gray-300 rounded w-full animate-pulse"></div>
    </div>
  );
};

export default SkeletonRecoveryCodeVerificationForm;