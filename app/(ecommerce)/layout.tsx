import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Main from "@/components/Main";
import Footer from "@/components/Footer";
import { getCategoriesPublic, getPublicHighlightCategories } from "@/lib/dataLayer";
import ScrollToTop from "@/components/ScrollToTop";
import Hydration from "@/components/Hydration";
import ModalSetAddress from "@/components/ModalSetAddress";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [categories, highlightCategories] = await Promise.all([
      getCategoriesPublic(),
      getPublicHighlightCategories()
    ]);

    const categoryNames = categories.map(category => category.name).join(', ');
    const highlightCategoryNames = highlightCategories.map(category => category.name).join(', ');

    return {
      title: {
        default: "Prontapp E-commerce | Tu tienda en línea favorita",
        template: "%s | Prontapp E-commerce"
      },
      description: `Descubre nuestra amplia selección de productos en categorías como ${categoryNames}. Destacamos ${highlightCategoryNames}. Compra online con envío rápido y seguro.`,
      keywords: ['ecommerce', 'tienda online', 'compras en línea', ...categories.map(cat => cat.name.toLowerCase())],
      authors: [{ name: "Prontapp" }],
      creator: "Prontapp",
      publisher: "Prontapp",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(process.env.DOMAIN_URL || 'https://www.pront.app'),
      alternates: {
        canonical: '/',
        languages: {
          'es-CO': '/',
        },
      },
      openGraph: {
        title: "Prontapp E-commerce | Tu tienda en línea favorita",
        description: `Explora ${categories.length} categorías de productos con los mejores precios y calidad.`,
        url: '/',
        siteName: 'Prontapp E-commerce',
        images: [
          {
            url: 'https://pront.app/images/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Prontapp E-commerce',
          },
        ],
        locale: 'es_CO',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Prontapp E-commerce | Compra online fácil y seguro',
        description: `Las mejores ofertas en ${categories.length} categorías de productos.`,
        images: ['https://pront.app/images/twitter-card.jpg'],
        creator: '@prontapp',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Prontapp E-commerce",
      description: "Tu tienda en línea favorita de artículos en tendencia",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const [categories, highlightCategories] = await Promise.all([
      getCategoriesPublic(),
      getPublicHighlightCategories()
    ]);

    return (
      <html lang="es">
        <body className={inter.className}>
          <Hydration />
          <AuthInitializer />
          <Header categories={categories} highlightCategories={highlightCategories} />
          <Main>{children}</Main>
          <Footer />
          <ScrollToTop />
          <ModalSetAddress />
        </body>
      </html>
    );
  } catch (error) {
    console.error("Hubo un error obteniendo los datos en el layout principal:", error);
    return (
      <html lang="es">
        <body className={inter.className}>
          <div>Error cargando la página. Por favor, intente más tarde.</div>
        </body>
      </html>
    );
  }
}