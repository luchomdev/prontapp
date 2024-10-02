"use client"
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const parsedImages = JSON.parse(images);
  const [selectedImage, setSelectedImage] = useState(parsedImages[0]?.url || '/placeholder.jpg');

  return (
    <div>
      <div className="relative w-full aspect-square mb-4">
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
          priority
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {parsedImages.map((image: { url: string }, index: number) => (
          <div
            key={index}
            className="w-20 h-20 relative flex-shrink-0 cursor-pointer"
            onClick={() => setSelectedImage(image.url)}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="80px"
              style={{ objectFit: 'cover' }}
              className={`rounded-md ${selectedImage === image.url ? 'border-2 border-blue-500' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;