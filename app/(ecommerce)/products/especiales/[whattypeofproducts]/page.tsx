import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import SpecialProductsShowImage from '@/components/specials/SpecialProductsShowImage';
import ProductsSpecialsListWrapper from '@/components/specials/ProductsSpecialsListWrapper';
import PaginationWrapper from '@/components/PaginationWrapper';
import SkeletonSpecialProducts from '@/components/specials/SkeletonSpecialProducts';
import { getDiscountProducts, getTrendyProducts, getBestSellerProducts, getPublicConfig } from '@/lib/dataLayer';

interface SpecialProductsPageProps {
    params: {
        whattypeofproducts: string;
    };
    searchParams: {
        page?: string;
    };
}

interface Props {
    params: { whattypeofproducts: string };
    searchParams: { page?: string };
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { whattypeofproducts } = params;
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

    let title = '';
    let description = '';
    
    switch(whattypeofproducts) {
        case 'discounts':
            title = 'Ofertas y Descuentos';
            description = 'Las mejores ofertas y descuentos en nuestra tienda online';
            break;
        case 'trendy':
            title = 'Productos en Tendencia';
            description = 'Descubre los productos más populares y en tendencia';
            break;
        case 'bestseller':
            title = 'Los Más Vendidos';
            description = 'Conoce nuestros productos más vendidos';
            break;
    }

    return {
        title: `${title} | Prontapp E-commerce (Página ${page})`,
        description,
        keywords: [title.toLowerCase(), 'productos', 'ofertas', 'tendencias', 'más vendidos'],
        openGraph: {
            title: `${title} - Prontapp E-commerce`,
            description,
        },
        alternates: {
            canonical: `/products/especiales/${whattypeofproducts}`,
        },
    };
}

const NoProductsMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">No hay productos disponibles</h2>
        <p className="text-gray-600 mb-6 text-center">Lo sentimos, no hemos encontrado productos para mostrar.</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
            Volver al Inicio
        </Link>
    </div>
);

export default async function SpecialProductsPage({ params, searchParams }: SpecialProductsPageProps) {
    const { whattypeofproducts } = params;
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
    
    let data;
    let products;
    let title;
    let isHighlight = false;
    const config = await getPublicConfig("titleProductsWithDiscounts,titleTrendyProducts,titleBestsellerProducts,imageSrcHeaderSpecialsProducts")
    let srcImage = `${process.env.IMAGE_BASE_URL}${config.imageSrcHeaderSpecialsProducts}`;
    switch(whattypeofproducts) {
        case 'discounts':
            data = await getDiscountProducts({ page, limit: 20 });
            products = data.products.map((product) => ({
                id: product.id,
                name: product.name,
                seo_slug: product.seo_slug ? product.seo_slug : "",
                price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
                precio_final: product.precio_final,
                images: JSON.parse(product.images)
              }))
            title = config.titleProductsWithDiscounts;
            isHighlight = true;
            break;
        case 'trendy':
            data = await getTrendyProducts({ page, limit: 20 });
            products = data.products.map((product) => ({
                id: product.id,
                name: product.name,
                seo_slug: product.seo_slug ? product.seo_slug : "",
                price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
                precio_final: product.precio_final,
                images: JSON.parse(product.images)
              }))
            title = config.titleTrendyProducts;
            //isHighlight = true;
            break;
        case 'bestseller':
            data = await getBestSellerProducts({ page, limit: 20 });
            products = data.products.map((product) => ({
                id: product.id,
                name: product.name,
                seo_slug: product.seo_slug ? product.seo_slug : "",
                price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
                precio_final: product.precio_final,
                images: JSON.parse(product.images)
              }))
            title = config.titleBestsellerProducts;
            break;
        default:
            return <NoProductsMessage />;
    }

    if (products.length === 0) {
        return <NoProductsMessage />;
    }

    return (
        <div>
            <SpecialProductsShowImage
                title={title ? title : "Productos con descuentos, HOT deals, novedades, tendencias, en prontapp consigue todo"}
                image={srcImage ? srcImage : ""}
            />
            <Suspense fallback={<SkeletonSpecialProducts count={20} />}>
                <ProductsSpecialsListWrapper 
                    products={products}
                    isHighlight={isHighlight}
                />
            </Suspense>
            {data.totalPages > 1 && (
                <PaginationWrapper
                    currentPage={page}
                    totalPages={data.totalPages}
                    baseUrl={`/products/especiales/${whattypeofproducts}`}
                />
            )}
        </div>
    );
}