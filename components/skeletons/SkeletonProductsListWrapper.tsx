import React from 'react';
import SkeletonHomeCardProduct from './SkeletonHomeCardProduct';

interface SkeletonProductsListWrapperProps {
  count?: number;
}

const SkeletonProductsListWrapper: React.FC<SkeletonProductsListWrapperProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonHomeCardProduct key={index} />
      ))}
    </div>
  );
};

export default SkeletonProductsListWrapper;