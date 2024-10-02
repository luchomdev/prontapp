import React from 'react';
import Image from 'next/image';

interface ProductsShowCategoryImageProps {
  category_image_data: string | null;
  category_name: string;
}

const ProductsShowCategoryImage: React.FC<ProductsShowCategoryImageProps> = ({ category_image_data, category_name }) => {
  if (category_image_data) {
    return (
      <div className="relative w-full h-48 md:h-64">
        <Image
          src={category_image_data}
          alt={category_name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
            {category_name}
          </h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full py-12 bg-gray-100 flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          {category_name}
        </h1>
      </div>
    );
  }
};

export default ProductsShowCategoryImage;