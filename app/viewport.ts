import type { Viewport } from 'next'

export const viewport: Viewport = {
    themeColor: '#2563EB',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    // Solo las propiedades que son parte del tipo Viewport
    colorScheme: 'light'
}