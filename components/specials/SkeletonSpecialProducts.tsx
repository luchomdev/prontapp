import React from 'react';
import SkeletonCardProduct from './SkeletonProductCard';

interface SkeletonSpecialProductsProps {
    count?: number;
}

const SkeletonSpecialProducts: React.FC<SkeletonSpecialProductsProps> = ({ count = 20 }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-8">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCardProduct key={index} />
            ))}
        </div>
    );
};

export default SkeletonSpecialProducts;