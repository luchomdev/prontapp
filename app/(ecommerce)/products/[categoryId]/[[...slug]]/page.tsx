import React from 'react';
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react';
import Link from 'next/link';
import ProductsShowCategoryImage from '@/components/ProductsShowCategoryImage';
import ProductsListWrapper from '@/components/ProductsListWrapper';
import PaginationWrapper from '@/components/PaginationWrapper';
import SkeletonProductsListWrapper from '@/components/skeletons/SkeletonProductsListWrapper';
import { getProductsPublic } from '@/lib/dataLayer';

interface CategoryPageProps {
  params: {
    categoryId: string;
    slug?: string[];
  };
  searchParams: {
    page?: string;
  };
}

interface Props {
  params: { categoryId: string; slug: string[] }
  searchParams: { page?: string }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { categoryId, slug } = params;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const data = await getProductsPublic({ category_id: categoryId, page: page, limit: 12 });
  const categoryName = data.products[0]?.category_name || '';
  const productCount = data.total;

  return {
    title: `${categoryName} | Prontapp E-commerce (Página ${page})`,
    description: `Explora nuestra selección de ${productCount} productos en la categoría ${categoryName}. Encuentra las mejores ofertas y precios en Prontapp E-commerce.`,
    keywords: [categoryName.toLowerCase(), 'productos', 'ofertas', 'productos en tendencias', 'comprar online', ' compra y paga contra entrega'],
    openGraph: {
      title: `${categoryName} - Mi E-commerce`,
      description: `Descubre ${productCount} productos en ${categoryName}. Compra online con envío rápido ó pago contraentrega.`,
      images: [
        {
          url: data.products[0]?.category_image_data || 'https://pront.app/images/default-category.jpg',
          width: 1200,
          height: 630,
          alt: `Categoría ${categoryName}`,
        },
      ],
    },
    alternates: {
      canonical: `/products/${categoryId}/${slug.join('/')}`,
    },
  }
}

const NoProductsMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
    <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">No hay productos en esta categoría</h2>
    <p className="text-gray-600 mb-6 text-center">Lo sentimos, no hemos encontrado productos para mostrar.</p>
    <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
      Volver al Inicio
    </Link>
  </div>
);

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoryId, slug } = params;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const data = await getProductsPublic({ category_id: categoryId, page: page, limit: 12 });

  if (data.products.length === 0) {
    return <NoProductsMessage />;
  }

  return (
    <div>
      <ProductsShowCategoryImage
        category_image_data={data.products[0]?.category_image_data}
        category_name={data.products[0]?.category_name || ''}
      />
      <Suspense fallback={<SkeletonProductsListWrapper count={data.products.length} />}>
        <ProductsListWrapper products={data.products} />
      </Suspense>
      {data.totalPages > 1 && (
        <PaginationWrapper
          currentPage={page}
          totalPages={data.totalPages}
          baseUrl={`/products/${categoryId}/${slug || ''}`}
        />
      )}
    </div>
  );
}