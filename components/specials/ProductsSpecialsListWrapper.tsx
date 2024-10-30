import React from 'react';
import ProductCard from '@/components/home/ProductCard';
import ProductCardHighlight from '@/components/home/ProductCardHighlight';

interface Product {
    id: string;
    name: string;
    seo_slug: string;
    price_fake_discount: number | null;
    precio_final: number;
    images: Array<{
      url: string;
    }>;
  }

interface ProductsSpecialsListWrapperProps {
    products: Product[];
    isHighlight?: boolean;
}

const ProductsSpecialsListWrapper: React.FC<ProductsSpecialsListWrapperProps> = ({ products, isHighlight = false }) => {
    const CardComponent = isHighlight ? ProductCardHighlight : ProductCard;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-4 mx-4 sm:my-8 sm:mx-8">
            {products.map((product) => (
                <CardComponent key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductsSpecialsListWrapper;