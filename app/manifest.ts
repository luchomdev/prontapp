import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Prontapp E-commerce | Tu tienda en línea favorita',
        short_name: 'Prontapp',
        description: 'Compra fácil y seguro con pago contra entrega. Las mejores ofertas en productos de tendencia.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        id: '/',
        scope: '/',
        lang: 'es-CO',
        categories: ['shopping', 'lifestyle'],
        icons: [
            {
                src: '/icons/maskable_icon_x48.png',
                sizes: '48x48',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x72.png',
                sizes: '72x72',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x96.png',
                sizes: '96x96',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x128.png',
                sizes: '128x128',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x384.png',
                sizes: '384x384',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/maskable_icon_x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            }
        ],
        shortcuts: [
            {
                name: "Ver Carrito",
                short_name: "Carrito",
                description: "Revisa los productos en tu carrito",
                url: "/cart",
                icons: [
                    {
                        src: "/icons/cart-96x96.png",
                        sizes: "96x96",
                        type: "image/png"
                    }
                ]
            }
        ],
        prefer_related_applications: false
    }
}