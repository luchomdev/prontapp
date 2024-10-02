// components/HighlightCategoriesFooter.tsx
import React from 'react';
import Link from 'next/link';
import { HighlightCategory } from '@/lib/dataLayer';

interface HighlightCategoriesFooterProps {
  categories: HighlightCategory[];
}

const HighlightCategoriesFooter: React.FC<HighlightCategoriesFooterProps> = ({ categories }) => {
  return (
    <div>
      <h3 className="font-bold mb-4">Categorías Destacadas</h3>
      <ul className="space-y-2 text-sm">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/products/${category.id}/${category.slug}`}>
              <span className="hover:text-orange-500 transition-colors duration-200">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightCategoriesFooter;