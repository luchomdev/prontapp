import type { Metadata } from "next";
import Script from "next/script"
import Image from 'next/image'
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
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ["latin"] });
const fbpixel = process.env.NEXT_PUBLIC_FBPIXEL;

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
      metadataBase: new URL(process.env.DOMAIN_URL || 'https://www.prontapp.co'),
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
            url: 'https://www.prontapp.co/images/og-image.jpg',
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
        images: ['https://www.prontapp.co/storage/images/twitter-card.jpg'],
        creator: '@prontapp',
      },
      other: {
        'facebook-domain-verification': 'cyijuhhuin4rp3tdq6vj5hcle6mq35'
      }
    };
  } catch (error) {
    console.error("Error generando metadata:", error);
    return {
      title: "Prontapp E-commerce",
      description: "Tu tienda en línea favorita de artículos en tendencia",
      other: {
        'facebook-domain-verification': 'cyijuhhuin4rp3tdq6vj5hcle6mq35'
      }
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
          {/* AdRoll Scripts */}
          <Script
            id="adroll-setup"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.adroll_adv_id = "RU5AS64GKBC7HOWDUY5LUC";
                window.adroll_pix_id = "QYWQ23PIIFA2NA4NI6LVJY";
                window.adroll_version = "2.0";
              `
            }}
          />
          <Script
            id="adroll-main"
            strategy="afterInteractive"
            src="https://s.adroll.com/j/RU5AS64GKBC7HOWDUY5LUC/roundtrip.js"
          />
          <Script
            id="adroll-track"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (typeof window !== 'undefined' && window.adroll && window.adroll.track) {
                    window.adroll.track("pageView");
                  }
                } catch (error) {
                  console.log('AdRoll tracking error:', error);
                }
              `
            }}
          />
          
          <Hydration />
          <AuthInitializer />
          <Header categories={categories} highlightCategories={highlightCategories} />
          <Main>{children}</Main>
          <Footer />
          <ScrollToTop />
          <ModalSetAddress />
          <Analytics />

          {/* Facebook Pixel */}
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
          >
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbpixel}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <Image
              src={`https://www.facebook.com/tr?id=${fbpixel}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
              width={1}
              height={1}
              style={{ display: "none" }}
              unoptimized
            />
          </noscript>
        </body>
      </html>
    );
  } catch (error) {
    console.error("Hubo un error obteniendo los datos en el layout principal:", error);
    return (
      <html lang="es">
        <body className={inter.className}>
          <div>Error cargando la página. Por favor, intente más tarde.</div>
          <Analytics />
          
          {/* AdRoll Scripts */}
          <Script
            id="adroll-setup"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.adroll_adv_id = "RU5AS64GKBC7HOWDUY5LUC";
                window.adroll_pix_id = "QYWQ23PIIFA2NA4NI6LVJY";
                window.adroll_version = "2.0";
              `
            }}
          />
          <Script
            id="adroll-main"
            strategy="afterInteractive"
            src="https://s.adroll.com/j/RU5AS64GKBC7HOWDUY5LUC/roundtrip.js"
          />
          <Script
            id="adroll-track"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (typeof window !== 'undefined' && window.adroll && window.adroll.track) {
                    window.adroll.track("pageView");
                  }
                } catch (error) {
                  console.log('AdRoll tracking error:', error);
                }
              `
            }}
          />

          {/* Facebook Pixel */}
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
          >
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbpixel}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <Image
              src={`https://www.facebook.com/tr?id=${fbpixel}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
              width={1}
              height={1}
              style={{ display: "none" }}
              unoptimized
            />
          </noscript>
        </body>
      </html>
    );
  }
}