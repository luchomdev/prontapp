"use client"
import React, { useState, useEffect } from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  const [sanitizedDescription, setSanitizedDescription] = useState(description);

  useEffect(() => {
    const sanitizeDescription = async () => {
      const DOMPurify = (await import('dompurify')).default;
      setSanitizedDescription(DOMPurify.sanitize(description));
    };

    sanitizeDescription();
  }, [description]);

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Descripción del producto</h2>
      <div 
        className="text-sm prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </div>
  );
};

export default ProductDescription;