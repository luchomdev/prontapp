import { Metadata, ResolvingMetadata } from 'next'
import { Product, WithContext, BreadcrumbList,AggregateRating, Review } from 'schema-dts'
import ProductDetailComp from "@/components/ProductDetail";
import { getProductById, getProductsPublic, ProductDetail, ProductForHome, ProductOrProductForHome, getProductReviews, stripHtmlTags } from "@/lib/dataLayer";

interface ProductDetailPageProps {
    params: {
        productId: string;
        slug?: string[]
    }
}
interface Props {
    params: { productId: string; slug: string[] }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { productId } = params;
    const product = await getProductById(productId);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        }
    }

    return {
        title: `${product.name} | Prontapp E-commerce`,
        description: stripHtmlTags(product.description).substring(0, 160),
        keywords: [product.name, product.category_name || 'productos en tendencia', 'comprar', 'online'],
        openGraph: {
            title: product.name,
            description: stripHtmlTags(product.description).substring(0, 160),
            images: [
                {
                    url: JSON.parse(product.images)[0]?.url || 'https://pront.app/images/default-product.jpg',
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            type: 'website', // Cambiado de 'product' a 'website'
            // Añadimos propiedades específicas del producto
            siteName: 'Prontapp E-commerce',
            locale: 'es_CO',
            url: `https://${process.env.DOMAIN_URL}/product/${productId}/${params.slug ? params.slug.join('/') : ''}`,
        },
        alternates: {
            canonical: `/product/${productId}/${params.slug ? params.slug.join('/') : ''}`,
        },
        other: {
            'product:price:amount': product.precio_final.toString(),
            'product:price:currency': 'COP',
        },
    }
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = async ({ params }) => {
    const { slug, productId } = params;
    const product: ProductDetail = await getProductById(productId);
    const relatedProducts: ProductOrProductForHome[] = await (await getProductsPublic({ limit: 10 })).products
    
    const reviews = await getProductReviews(productId)
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    const reviewCount = reviews.length

    const jsonLd: WithContext<Product> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: stripHtmlTags(product.description),
        image: JSON.parse(product.images)[0]?.url,
        sku: product.id,
        mpn: product.id,
        brand: {
            '@type': 'Brand',
            name: product.name || 'Prontapp',
        },
        offers: {
            '@type': 'Offer',
            url: `https://${process.env.DOMAIN_URL}/product/${productId}/${slug?.join('/')}`,
            priceCurrency: 'COP',
            price: product.precio_final,
            itemCondition: 'https://schema.org/NewCondition',
            availability: Number(product.amount) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviewCount,
            bestRating: 5,
            worstRating: 1
        },
        review: reviews.map((review): Review => ({
            '@type': 'Review',
            author: {
                '@type': 'Person',
                name: review.user_name,
            },
            datePublished: review.created_at.toString(),
            reviewBody: review.comment,
            name: review.comment.replace(/^(.{25}[^\s]*).*/, "$1"),
            reviewRating: {
                '@type': 'Rating',
                ratingValue: review.rating,
                bestRating: 5,
                worstRating: 1
            }
        }))
    }
    const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                item: {
                    '@id': `${process.env.DOMAIN_URL}`,
                    name: 'Inicio',
                },
            },
            {
                '@type': 'ListItem',
                position: 2,
                item: {
                    '@id': `${process.env.DOMAIN_URL}/products/${product.category_id}/${product.category_slug}`,
                    name: product.category_name || 'Productos en tendencia',
                },
            },
            {
                '@type': 'ListItem',
                position: 3,
                item: {
                    '@id': `${process.env.DOMAIN_URL}/product/${productId}/${slug?.join('/')}`,
                    name: product.name,
                },
            },
        ],
    }
    console.log("Params product detail", params)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProductDetailComp product={product} relatedProducts={relatedProducts} />
        </>

    )
}

export default ProductDetailPage