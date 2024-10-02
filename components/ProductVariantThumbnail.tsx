import React from 'react';

interface ProductVariantThumbnailProps {
  image: string;
}

const ProductVariantThumbnail: React.FC<ProductVariantThumbnailProps> = ({ image }) => {
  return (
    <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center">
      <span className="text-xs text-gray-500">Var</span>
    </div>
  );
};

export default ProductVariantThumbnail;