import React from 'react';
import HomeCardProduct from '@/components/HomeCardProduct';
import { ProductForHome, ProductOrProductForHome } from '@/lib/dataLayer';

// Esta interfaz debería estar definida en tu archivo de tipos
interface RelatedProductsProps {
  products: ProductOrProductForHome[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">También te pueden interesar</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {products.slice(0, 8).map((product) => (
          <div key={product.id} className="flex-shrink-0 max-w-[190px] sm:w-64">
            <HomeCardProduct product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;