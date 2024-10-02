// components/HighlightCategoriesHeader.tsx
import React from 'react';
import Link from 'next/link';
import { HighlightCategory } from '@/lib/dataLayer';

interface HighlightCategoriesHeaderProps {
  categories: HighlightCategory[];
}

const HighlightCategoriesHeader: React.FC<HighlightCategoriesHeaderProps> = ({ categories }) => {
  return (
    <div className="flex sm:mx-auto items-center space-x-4 text-gray-600 overflow-x-auto">
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          {index > 0 && <span className="text-gray-300">|</span>}
          <Link href={`/products/${category.id}/${category.slug}`}>
            <span className="whitespace-nowrap hover:text-orange-500 transition-colors duration-200">
              {category.name}({category.product_count})
            </span>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default HighlightCategoriesHeader;