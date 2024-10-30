import React from 'react';
import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react';
import SearchResultsHeader from '@/components/SearchResultsHeader';
import ProductsListWrapper from '@/components/ProductsListWrapper';
import PaginationWrapper from '@/components/PaginationWrapper';
import SkeletonProductsListWrapper from '@/components/skeletons/SkeletonProductsListWrapper';
import { getProductsPublic } from '@/lib/dataLayer';

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  };
}
interface Props {
  searchParams: { q?: string; page?: string; minPrice?: string; maxPrice?: string; sortBy?: string }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { q, page = '1', minPrice, maxPrice, sortBy } = searchParams;
  const currentPage = parseInt(page, 10);

  const data = await getProductsPublic({
    search: q,
    page: currentPage,
    min_price: minPrice,
    max_price: maxPrice,
    sort_by: sortBy
  });

  const title = q
    ? `Resultados para "${q}" | Prontapp E-commerce (Página ${currentPage})`
    : `Todos los productos | Prontapp E-commerce (Página ${currentPage})`;

  const description = q
    ? `Encuentra ${data.total} resultados para "${q}". Explora nuestra selección de productos y ofertas.`
    : `Descubre nuestra colección de ${data.total} productos. Encuentra las mejores ofertas y precios en Prontapp E-commerce.`;

  return {
    title,
    description,
    keywords: [q || 'productos', 'búsqueda', 'ofertas', 'comprar online'],
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `/products?${new URLSearchParams(searchParams).toString()}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

// Helper function to filter out undefined values and convert to string
const filterParams = (params: Record<string, string | undefined>): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  );
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page = '1', minPrice, maxPrice, sortBy } = searchParams;
  const currentPage = parseInt(page, 10);

  const data = await getProductsPublic({
    search: q,
    page: currentPage,
    min_price: minPrice,
    max_price: maxPrice,
    sort_by: sortBy
  });

  const filteredParams = filterParams({ q, minPrice, maxPrice, sortBy });

  return (
    <div>
      {q ?
        (<SearchResultsHeader
          searchTerm={q || ''}
          totalResults={data.total}
        />):(
          <h1 className='text-2xl md:text-3xl m-2 md:m-4'>{data.total}, productos</h1>
        )
      }

      <Suspense fallback={<SkeletonProductsListWrapper count={data.products.length} />}>
        <ProductsListWrapper products={data.products} />
      </Suspense>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={data.totalPages}
        baseUrl="/products"
        extraParams={filteredParams}
      />
    </div>
  );
}