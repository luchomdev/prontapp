'use server'

interface SearchResult {
  id: string;
  name: string;
  precio_final: string;
  images: string;
}

export async function searchProducts(term: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/products/public?search=${encodeURIComponent(term)}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    return data.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      precio_final: product.precio_final,
      images: product.images
    }));
  } catch (error) {
    console.error('Error in searchProducts server action:', error);
    return [];
  }
}