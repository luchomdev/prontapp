import React from 'react';

const SkeletonResetPasswordForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>

      <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>

      <div className="h-16 bg-gray-300 rounded w-full animate-pulse"></div>
    </div>
  );
};

export default SkeletonResetPasswordForm;