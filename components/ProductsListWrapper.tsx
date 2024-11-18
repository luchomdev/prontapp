import React from 'react';
import HomeCardProduct from './HomeCardProduct';
import { ProductOrProductForHome } from '@/lib/dataLayer';

interface ProductsListWrapperProps {
  products: ProductOrProductForHome[];
}

const ProductsListWrapper: React.FC<ProductsListWrapperProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 my-4 mx-4 sm:my-8 sm:mx-8">
      {products.map((product) => (
        <HomeCardProduct key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsListWrapper;