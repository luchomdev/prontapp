import { Metadata, ResolvingMetadata } from 'next'
import HomeSectionContainer from "@/components/HomeSectionContainer";
import ImageSlider from "@/components/ImageSlider";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import ProductCategorySection from '@/components/ProductCategorySection';
import RecentlyViewed from "@/components/RecentlyViewed";
import { getProductsByCategoriesHome, getSliderImages } from "@/lib/dataLayer";

export async function generateMetadata(
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
          url: 'https://pront.app/og-home.jpg',
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
      images: ['https://pront.app/og-home.jpg'],
    },
  }
}

export default async function Home() {
  try {
    const categoriesData = await getProductsByCategoriesHome();
    const headersBanners = await getSliderImages();

    return (
      <div className="flex flex-col min-h-screen">
        <ImageSlider images={headersBanners} />

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