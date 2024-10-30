"use client"
import React from 'react';

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Skeleton for image */}
      <div className="aspect-video rounded-t-lg overflow-hidden">
        <div className="w-full h-full bg-gray-200 animate-pulse"/>
      </div>
      
      <div className="p-3">
        {/* Skeleton for title - 2 lines */}
        <div className="space-y-1 mb-1">
          <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"/>
          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"/>
        </div>

        {/* Skeleton for prices */}
        <div className="space-y-1">
          {/* Skeleton for old price */}
          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/4"/>
          
          {/* Skeleton for current price */}
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/5"/>
        </div>

        {/* Skeleton for arrow icon */}
        <div className="absolute bottom-3 right-3">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"/>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;