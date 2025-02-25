import { Metadata, ResolvingMetadata } from 'next'
import HomeSectionContainer from "@/components/HomeSectionContainer";
import ImageSlider from "@/components/ImageSlider";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import ProductCategorySection from '@/components/ProductCategorySection';
import RecentlyViewed from "@/components/RecentlyViewed";
import { getProductsByCategoriesHome, getSliderImages, getProductsPublic, getTrendyProducts, getDiscountProducts, getBestSellerProducts, getPublicConfig } from "@/lib/dataLayer";
import ProductSectionContainer from '@/components/home/ProductSectionContainer';
import ProntappAdvantages from '@/components/ProntappAdvantages';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categoriesData = await getProductsByCategoriesHome();
  const categories = Object.values(categoriesData).map(cat => cat.name).join(', ');

  return {
    title: 'Prontapp E-commerce | Tu tienda en línea favorita',
    description: `Descubre nuestra amplia selección de productos en categorías como ${categories}. Compra online con envío rápido y seguro.`,
    keywords: ['ecommerce', 'tienda online', 'compras en línea', ...Object.values(categoriesData).map(cat => cat.name.toLowerCase())],
    openGraph: {
      title: 'Prontapp E-commerce | Tu tienda en línea favorita',
      description: `Explora ${Object.keys(categoriesData).length} categorías de productos con los mejores precios y calidad.`,
      images: [
        {
          url: 'https://www.prontapp.co/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'Prontapp E-commerce - Página de inicio',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Prontapp E-commerce | Compra online fácil y seguro',
      description: `Las mejores ofertas en ${Object.keys(categoriesData).length} categorías de productos.`,
      images: ['https://www.prontapp.co/x-home.jpg'],
    },
  }
}

export default async function Home() {
  try {
    // Datos config
    const config = await getPublicConfig("urlAllHotdeals,titleHotdeals,catHotdeals,titleProductsWithDiscounts,urlProductsWithDiscounts,titleTrendyProducts,urlTrendyProducts,titleBestsellerProducts,urlBestsellerProducts")
    const categoriesData = await getProductsByCategoriesHome();
    const headersBanners = await getSliderImages();
    const hotDealsProducts = await getProductsPublic({ category_id: config.catHotdeals ? config.catHotdeals : "cb587118-4629-4ba6-a390-c613a04aac9b", limit: 20 })
    const hotDeals = hotDealsProducts.products.map((product) => ({
      id: product.id,
      name: product.name,
      seo_slug: product.seo_slug ? product.seo_slug : "",
      price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
      precio_final: product.precio_final,
      images: JSON.parse(product.images)
    }))

    const [trendy, discounted, bestSellers] = await Promise.all([
      getTrendyProducts({ limit: 20 }),
      getDiscountProducts({ limit: 20 }),
      getBestSellerProducts({ limit: 20 })
    ]);
    const discountedProducts = discounted.products.map((product) => ({
      id: product.id,
      name: product.name,
      seo_slug: product.seo_slug ? product.seo_slug : "",
      price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
      precio_final: product.precio_final,
      images: JSON.parse(product.images)
    }))
    const trendyProducts = trendy.products.map((product) => ({
      id: product.id,
      name: product.name,
      seo_slug: product.seo_slug ? product.seo_slug : "",
      price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
      precio_final: product.precio_final,
      images: JSON.parse(product.images)
    }))
    const bestSellerProducts = bestSellers.products.map((product) => ({
      id: product.id,
      name: product.name,
      seo_slug: product.seo_slug ? product.seo_slug : "",
      price_fake_discount: product.price_fake_discount ? Number(product.price_fake_discount) : null,
      precio_final: product.precio_final,
      images: JSON.parse(product.images)
    }))




    return (
      <div className="flex flex-col min-h-screen">
        <ImageSlider images={headersBanners} />
        {hotDeals && hotDeals.length > 0 &&
          <ProductSectionContainer
            title={config.titleHotdeals ? config.titleHotdeals : ""}
            viewAllLink={config.urlAllHotdeals ? config.urlAllHotdeals : ""}
            products={hotDeals}
            isHighlight={true}
          />
        }

        {discountedProducts && discountedProducts.length > 0 &&
          <ProductSectionContainer
            title={config.titleProductsWithDiscounts ? config.titleProductsWithDiscounts : "" }
            viewAllLink={config.urlProductsWithDiscounts ? config.urlProductsWithDiscounts : ""}
            products={discountedProducts}
            isHighlight={true}
          />
        }

        {trendyProducts && trendyProducts.length > 0 &&
          <ProductSectionContainer
            title={config.titleTrendyProducts ? config.titleTrendyProducts : ""}
            viewAllLink={config.urlTrendyProducts ? config.urlTrendyProducts : "" }
            products={trendyProducts}
          />
        }

        {bestSellerProducts && bestSellerProducts.length > 0 &&
          <ProductSectionContainer
            title={config.titleBestsellerProducts ? config.titleBestsellerProducts : "" }
            viewAllLink={config.urlBestsellerProducts ? config.urlBestsellerProducts : ""}
            products={bestSellerProducts}
          />
        }


        {Object.entries(categoriesData).map(([id, category]) => (
          <ProductCategorySection
            key={id}
            title={category.name}
            products={category.products}
            viewAllLink={`/products/${id}/${category.slug}`}
            viewAllText={`Ver todos los productos en ${category.name}`}
          />
        ))}
        <HomeSectionContainer>
          <RecentlyViewed />
        </HomeSectionContainer>
        <ProntappAdvantages />
        <NewsletterSubscription />
      </div>
    );
  } catch (error) {
    console.error("Error fetching home data:", error);
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error cargando la página</h1>
        <p>Lo sentimos, ha ocurrido un error al cargar los datos. Por favor, intente más tarde.</p>
      </div>
    );
  }
}