// app/api/google-merchant/products/route.ts
import { type NextRequest } from 'next/server'
import { getProductsPublic, parseProductImages } from '@/lib/dataLayer'


export async function GET(request: NextRequest) {
  try {
    const { products } = await getProductsPublic({
        limit:1000,
        page:1
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>Prontapp Store Products</title>
        <link>${process.env.DOMAIN_URL}</link>
        <description>Productos de Prontapp</description>
        ${products.map(product => {
          // Parseamos las imágenes del string JSON a array de objetos
          const productImages = parseProductImages(product.images);
          const firstImageUrl = productImages[0]?.url || '';

          return `
          <item>
            <g:id>${product.stock_id}</g:id>
            <g:title>${escapeXml(product.name)}</g:title>
            <g:description>${escapeXml(product.description)}</g:description>
            <g:link>${process.env.DOMAIN_URL}/product/${product.id}/${product.seo_slug}</g:link>
            <g:image_link>${escapeXml(firstImageUrl)}</g:image_link>
            <g:availability>${Number(product.amount) > 0 ? 'in stock' : 'out of stock'}</g:availability>
            <g:price>${product.precio_final} COP</g:price>
            <g:brand>Prontapp</g:brand>
            <g:condition>new</g:condition>
            <g:identifier_exists>false</g:identifier_exists>
          </item>
        `}).join('')}
      </channel>
    </rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400' // Cache por 24 horas
      }
    })
  } catch (error) {
    console.error('Error generating merchant feed:', error);
    return new Response('Error generating feed', { status: 500 })
  }
}

function escapeXml(unsafe: string) {
  return unsafe?.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  }) || '';
}