"use client"
import React from 'react';
import Image from 'next/image';
import { ProductDetail, ProductVariant, parseProductImages } from '@/lib/dataLayer';

interface VariantSelectorProps {
    variants: (ProductDetail | ProductVariant)[];
    selectedVariant: ProductDetail;
    onSelect: (variant: ProductVariant) => void;
  }

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selectedVariant, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Opciones: {selectedVariant.name}</h3>
      <div className="flex space-x-2 overflow-x-auto">
        {variants.map((variant) => {
          const images = parseProductImages(variant.images);
          const mainImage = images[0]?.url || '/placeholder.jpg';
          return (
            <div
              key={variant.id}
              className={`w-20 h-20 relative flex-shrink-0 cursor-pointer ${
                selectedVariant.id === variant.id ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => onSelect(variant as ProductVariant)}
            >
              <Image
                src={mainImage}
                alt={variant.name}
                fill
                sizes="80px"
                style={{ objectFit: 'cover' }}
                className="rounded-md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;