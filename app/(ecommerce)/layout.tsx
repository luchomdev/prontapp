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
import SubscribeToPush from "@/components/notifications/SubscribeToPush";
import InstallPrompt from "@/components/notifications/InstallPrompt";
import { AppleSplashScreen } from "@/components/AppleSplashScreen";

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
      manifest: '/manifest.json',
      // Configuración PWA
      appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Prontapp',
        startupImage: [
          {
            url: '/splash/splash-320x426.png',
            media: '(device-width: 320px) and (device-height: 426px)'
          },
          {
            url: '/splash/splash-320x470.png',
            media: '(device-width: 320px) and (device-height: 470px)'
          },
          {
            url: '/splash/splash-480x640.png',
            media: '(device-width: 480px) and (device-height: 640px)'
          },
          {
            url: '/splash/splash-720x960.png',
            media: '(device-width: 720px) and (device-height: 960px)'
          },
          {
            url: '/splash/splash-750x1334.png',
            media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
          },
          {
            url: '/splash/splash-960x1280.png',
            media: '(device-width: 960px) and (device-height: 1280px)'
          },
          {
            url: '/splash/splash-1125x2436.png',
            media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
          },
          {
            url: '/splash/splash-1242x2208.png',
            media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
          },
          {
            url: '/splash/splash-1280x1920.png',
            media: '(device-width: 1280px) and (device-height: 1920px)'
          },
          {
            url: '/splash/splash-1536x2048.png',
            media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
          },
          {
            url: '/splash/splash-1668x2224.png',
            media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)'
          },
          {
            url: '/splash/splash-2048x2732.png',
            media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
          }
        ]
      },
      other: {
        'facebook-domain-verification': 'cyijuhhuin4rp3tdq6vj5hcle6mq35',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'apple-mobile-web-app-title': 'Prontapp',
        // Agregar estas líneas específicas para splash screen
        'apple-touch-startup-image': '/splash/splash-2048x2732.png'
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
      }
    };
  } catch (error) {
    console.error("Error generando metadata:", error);
    return {
      title: "Prontapp E-commerce",
      description: "Tu tienda en línea favorita de artículos en tendencia",
      manifest: '/manifest.json',
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Prontapp'
      },
      themeColor: '#2563EB',
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
        viewportFit: 'cover'
      },
      other: {
        'facebook-domain-verification': 'cyijuhhuin4rp3tdq6vj5hcle6mq35',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'Prontapp'
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
        <head>
          {/* Google Tag Manager - Script principal */}
          <Script
            id="google-tag-manager"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PJBN2VS3');
              `
            }}
          />
          <script
            id="register-sw"
            dangerouslySetInnerHTML={{
              __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
          try {
            console.log('Iniciando registro de SW');
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registrado:', registration);

            registration.addEventListener('statechange', (e) => {
              console.log('Estado del SW cambiado:', e.target.state);
            });
          } catch (error) {
            console.error('Error al registrar SW:', error);
          }
        });
      } else {
        console.log('Service Worker no soportado');
      }
    `
            }}
          />
          <AppleSplashScreen />
        </head>
        <body className={inter.className}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PJBN2VS3"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
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
          <InstallPrompt />
          <div className="fixed bottom-4 right-4 z-50">
            <SubscribeToPush />
          </div>
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