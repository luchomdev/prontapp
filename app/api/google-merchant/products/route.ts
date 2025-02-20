// app/api/google-merchant/products/route.ts
import { type NextRequest } from "next/server";
import { getProductsPublic, parseProductImages } from "@/lib/dataLayer";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: NextRequest) {
  try {
    const { products } = await getProductsPublic({
      limit: 1000,
      page: 1,
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>Prontapp Store Products</title>
        <link>${process.env.DOMAIN_URL}</link>
        <description>Productos de Prontapp</description>
        ${products
          .map((product) => {
            const productImages = parseProductImages(product.images);
            const firstImageUrl = productImages[0]?.url || "";
            const productSlug = product.seo_slug || generateSlug(product.name);
            //const productPrice = `${product.precio_final.toFixed(2)} COP`; // Cambio a COP
            const productPrice = `${Number(product.precio_final).toFixed(2)} COP`;
            const productCondition = "new"; // Se puede cambiar si hay información
            const productBrand = "Sin marca"; // Si no tiene marca, indicar

            return `
          <item>
            <g:id>${product.stock_id}</g:id>
            <g:title>${escapeXml(product.name)}</g:title>
            <g:description>${escapeXml(product.description)}</g:description>
            <g:link>${process.env.DOMAIN_URL}/product/${product.id}/${productSlug}</g:link>
            <g:image_link>${escapeXml(firstImageUrl)}</g:image_link>
            <g:availability>${
              Number(product.amount) > 0 ? "in stock" : "out of stock"
            }</g:availability>
            <g:price>${productPrice}</g:price>
            <g:condition>${productCondition}</g:condition>
            <g:brand>${productBrand}</g:brand>
          </item>`;
          })
          .join("\n")}
      </channel>
    </rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating Google Merchant XML:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}
