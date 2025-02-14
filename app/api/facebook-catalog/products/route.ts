// app/api/facebook-catalog/products/route.ts
import { type NextRequest } from 'next/server'
import { getProductsPublic, parseProductImages } from '@/lib/dataLayer'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { products } = await getProductsPublic({
      limit: 1000,
      page: 1
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
      <title>Prontapp Store Products</title>
      <link>${process.env.DOMAIN_URL}</link>
      ${products.map(product => {
        const productImages = parseProductImages(product.images);
        const firstImageUrl = productImages[0]?.url || '';
        const productSlug = product.seo_slug || generateSlug(product.name);
        const additionalImages = productImages.slice(1, 10).map(img => 
          `<additional_image_link>${escapeXml(img.url)}</additional_image_link>`
        ).join('');

        return `
        <entry>
          <g:id>${product.stock_id}</g:id>
          <g:title>${escapeXml(product.name)}</g:title>
          <g:description>${escapeXml(product.description)}</g:description>
          <g:link>${process.env.DOMAIN_URL}/product/${product.id}/${productSlug}</g:link>
          <g:image_link>${escapeXml(firstImageUrl)}</g:image_link>
          ${additionalImages}
          <g:availability>${Number(product.amount) > 0 ? 'in stock' : 'out of stock'}</g:availability>
          <g:price>${product.precio_final} COP</g:price>
          <g:brand>Prontapp</g:brand>
          <g:condition>new</g:condition>
          <g:inventory>${Number(product.amount)}</g:inventory>
          <g:currency>COP</g:currency>
        </entry>
      `}).join('')}
    </feed>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400'
      }
    })
  } catch (error) {
    console.error('Error generating Facebook feed:', error);
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