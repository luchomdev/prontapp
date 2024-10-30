"use client"
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Descripción del producto</h2>
      <div className="text-sm">
        <MarkdownRenderer content={description} />
      </div>
    </div>
  );
};

export default ProductDescription;