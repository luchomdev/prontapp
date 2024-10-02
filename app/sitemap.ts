import { getProductsPublic, getCategoriesPublic } from "@/lib/dataLayer";

export default async function sitemap() {
  const baseUrl = process.env.HTTP_S_DOMAIN_URL || 'http://localhost:3000';

  // Obtén todas las categorías
  const categories = await getCategoriesPublic();

  // Obtén todos los productos (considera la paginación si son muchos)
  const products = await getProductsPublic({ limit: 1000 });

  const categoriesUrls = categories.map((category) => ({
    url: `${baseUrl}/products/${category.id}/${category.slug}`,
    lastModified: new Date(),
  }));

  const productsUrls = products.products.map((product) => ({
    url: `${baseUrl}/product/${product.id}/${product.seo_slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
    },
    ...categoriesUrls,
    ...productsUrls,
  ]
}