// components/ProductCategorySection.tsx
import React from 'react';
import Image from 'next/image';
import ClientWrapper from '@/components/SeeMore';
import HomeCardProduct from './HomeCardProduct';
import { Product, ProductForHome } from '@/lib/dataLayer';

type ProductOrProductForHome = Product | ProductForHome;

interface ProductCategorySectionProps {
  title: string;
  backgroundColor?: string;
  products: ProductOrProductForHome[];
  viewAllLink: string;
  viewAllText: string;
}

const ProductCategorySection: React.FC<ProductCategorySectionProps> = ({
  title,
  backgroundColor = 'white',
  products,
  viewAllLink,
  viewAllText
}) => {
  const bannerImage = products.length > 0 && 'category_image_data' in products[0] && products[0].category_image_data
    ? products[0].category_image_data
    : undefined;

  return (
    <section className="w-full" style={{ backgroundColor }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center border-b border-gray-200 mb-6">
          <h2 className="text-xl font-bold pb-2 border-b-2 border-orange-500">{title}</h2>
          <ClientWrapper viewAllLink={viewAllLink} buttonText={viewAllText} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <HomeCardProduct 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

        {bannerImage && (
          <div className="mt-8 relative w-full aspect-[6/1]">
            <Image
              src={bannerImage}
              alt="Category Banner"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCategorySection;