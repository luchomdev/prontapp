// lib/dataLayer.ts

import { cache } from 'react';

const API_BASE_URL = process.env.API_BASE_URL || '';
export const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL || '';

export interface ConfigResponse {
    [key: string]: string | null;
  }

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    slug: string;
    level: number;
}

interface ProductImage {
    image: string;
    url: string;
}


export interface Product {
    id: string;
    stock_id: number;
    product_id: number;
    name: string;
    description: string;
    amount: string;
    price_by_unit: string;
    images: string;
    merge_by: string | null;
    category_name: string | null;
    category_slug: string | null;
    average_rating: string;
    rating_count: string;
    category_image_data: string | null;
    category_image_type: string | null;
    variants: ProductVariant[];
    precio_final: number;
    measures: string | { [key: string]: string };
    price_fake_discount: string | null;
    min_qty: number;
    seo_slug: string | null;
    seo_keywords: string | null;
    seo_description: string | null;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductForHome {
    id: string;
    stock_id: number;
    product_id: number;
    name: string;
    description: string;
    amount: number;
    price_by_unit: number;
    discount: number;
    images: string;
    merge_by: string | null;
    category_name: string | null;
    category_slug: string | null;
    average_rating: number;
    rating_count: number;
    category_image_data?: string;
    category_image_type?: string;
    variants: ProductVariant[];
    precio_final: number;
    measures: string | { [key: string]: string };
    price_fake_discount: string | null;
    min_qty: number;
    seo_slug: string | null;
}

interface CategoryWithProducts {
    name: string;
    id: string;
    image_data: string | null;
    slug: string;
    products: ProductForHome[];
}

interface HomeCategoriesResponse {
    [key: string]: CategoryWithProducts;
}

// Nueva interfaz para getPublicHighlightCategories
export interface HighlightCategory {
    id: string;
    name: string;
    slug: string;
    product_count: number;
}

export type ProductOrProductForHome = Product | ProductForHome;
export interface ProductDetail extends Product {
    cellar_id: number;
    discount: number | null;
    reference: string;
    minimal_price: string;
    price_dropshipping: string;
    video: string | null;
    warranty: string;
    category_id: string | null;
    created_at: string;
    updated_at: string;
    ratings: ProductRating[];
}

export interface ProductRating {
    name: string;
    rating: number;
    comment: string;
    created_at: string;
}

// Actualiza la interfaz ProductVariant existente si es necesario
export interface ProductVariant {
    id: string;
    stock_id: number;
    product_id: number;
    name: string;
    description: string;
    price_by_unit: string;
    images: string;
    measures: string;
    discount: number | null;
    precio_final: number;
    price_fake_discount: string | null;
}

interface ProductQueryParams {
    min_price?: string;
    max_price?: string;
    search?: string;
    category_id?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface BannerImage {
    id: string;
    title: string;
    image_data: string;
    link: string;
    order_index: number;
}

export interface ProductReviews {
    rating: number,
    comment: string;
    created_at: Date;
    updated_at: Date;
    user_name: string;
}

export interface BestSellerProduct {
    id: string;
    stock_id: number;
    name: string;
    images: string;
    price_by_unit: string;
    price_fake_discount: string | null;
    precio_final: number;
    min_qty: number;
    measures: string;
    seo_slug: string | null;
    total_sold: string;
}

export interface BestSellerResponse {
    products: BestSellerProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ProductListQueryParams {
    page?: number;
    limit?: number;
}

// Función auxiliar para parsear las imágenes
export function parseProductImages(imagesJson: string): ProductImage[] {
    try {
        return JSON.parse(imagesJson);
    } catch (error) {
        console.error('Error parsing product images:', error);
        return [];
    }
}

export function parseMeasures(measures: string | { [key: string]: string }): { [key: string]: string } {
    if (typeof measures === 'object') {
        return measures;
    }
    try {
        return JSON.parse(measures);
    } catch (error) {
        console.error('Error parsing measures:', error);
        return {};
    }
}

export const getCategoriesPublic = cache(async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/public`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
});

export const getProductsPublic = cache(async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${API_BASE_URL}/products/public?${queryParams.toString()}`;
        const response = await fetch(url, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Asegúrate de que los campos numéricos se conviertan correctamente
        return {
            ...data,
            products: data.products.map((product: ProductOrProductForHome) => ({
                ...product,
                stock_id: Number(product.stock_id),
                product_id: Number(product.product_id),
                price_by_unit: parseFloat(product.price_by_unit.toString()),
                average_rating: parseFloat(product.average_rating.toString()),
                rating_count: parseInt(product.rating_count.toString(), 10),
                category_image_data: product.category_image_data ? `${IMAGE_BASE_URL}${product.category_image_data}` : undefined,
                variants: product.variants.map(variant => ({
                    ...variant,
                    stock_id: Number(variant.stock_id),
                    product_id: Number(variant.product_id),
                    price_by_unit: Number(variant.price_by_unit)
                }))
            }))
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
});

export const getProductsByCategoriesHome = cache(async (): Promise<HomeCategoriesResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/home`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch home categories and products');
        }
        const data: HomeCategoriesResponse = await response.json();

        // Procesamos los datos para asegurarnos de que los tipos sean correctos
        Object.keys(data).forEach(key => {
            data[key].products = data[key].products.map(product => ({
                ...product,
                amount: Number(product.amount),
                price_by_unit: Number(product.price_by_unit),
                discount: Number(product.discount),
                precio_final: Number(product.precio_final),
                average_rating: Number(product.average_rating),
                rating_count: Number(product.rating_count),
                category_image_data: product.category_image_data ? `${IMAGE_BASE_URL}${product.category_image_data}` : undefined,
            }));
        });

        return data;
    } catch (error) {
        console.error('Error fetching home categories and products:', error);
        throw error;
    }
});

export const getPublicHighlightCategories = cache(async (): Promise<HighlightCategory[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/highlight`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch highlight categories');
        }
        const data: HighlightCategory[] = await response.json();

        // Procesamos los datos para asegurarnos de que los tipos sean correctos
        return data.map(category => ({
            ...category,
            product_count: Number(category.product_count),
        }));
    } catch (error) {
        console.error('Error fetching highlight categories:', error);
        throw error;
    }
});

export const getProductById = cache(async (id: string): Promise<ProductDetail> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/public/${id}`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const data = await response.json();

        // Procesar los datos
        return {
            ...data,
            stock_id: Number(data.stock_id),
            product_id: Number(data.product_id),
            cellar_id: Number(data.cellar_id),
            discount: data.discount ? Number(data.discount) : null,
            precio_final: Number(data.precio_final),
            variants: data.variants.map((variant: ProductVariant) => ({
                ...variant,
                stock_id: Number(variant.stock_id),
                product_id: Number(variant.product_id),
                discount: variant.discount ? Number(variant.discount) : null,
            })),
            ratings: data.ratings || [],
        };
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
});

export const getProductReviews = cache(async (productId: string): Promise<ProductReviews[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/public/${productId}/reviews`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch product reviews');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching reviewa:', error);
        throw error;
    }
});


// Banners module
export const getSliderImages = cache(async (): Promise<BannerImage[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/banners/active?platform=web`, { next: { revalidate: 0 } });
        if (!response.ok) {
            throw new Error('Failed to fetch banner images');
        }
        const data: BannerImage[] = await response.json();

        // Añadir el prefijo IMAGE_BASE_URL a image_data
        return data.map(banner => ({
            ...banner,
            image_data: `${IMAGE_BASE_URL}${banner.image_data}`
        }));
    } catch (error) {
        console.error('Error fetching banner images:', error);
        throw error;
    }
});

export const getQRCode = cache(async (): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/app-download/qr-code`, { next: { revalidate: 0 } }); // Cache por 24 horas
        if (!response.ok) {
            throw new Error('Failed to fetch QR code');
        }
        const data = await response.json();
        return data.qrCode; // Asumiendo que la respuesta tiene una propiedad 'qrCode' con la imagen en base64
    } catch (error) {
        console.error('Error fetching QR code:', error);
        throw error;
    }
});

export function stripHtmlTags(str: string) {
    return str.replace(/<[^>]*>/g, '');
}

/**
 * Obtiene las configuraciones públicas del sistema
 * @param vars - String de variables separadas por coma (ejemplo: "faqs,site_name")
 * @returns Promise con un objeto que contiene las configuraciones solicitadas
 */
export const getPublicConfig = cache(async (vars: string): Promise<ConfigResponse> => {
    try {
        const queryParams = new URLSearchParams({ vars });
        const response = await fetch(
            `${API_BASE_URL}/config/public?${queryParams.toString()}`, 
            { 
                next: { revalidate: 0 }, // Cache por 1 hora
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch configurations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching configurations:', error);
        throw error;
    }
});

/**
 * Obtiene los productos en tendencia
 * @param params - Objeto con parámetros de consulta (page, limit)
 * @returns Promise con la lista de productos en tendencia
 */
export const getTrendyProducts = cache(async (params: ProductListQueryParams = {}): Promise<ProductsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${API_BASE_URL}/products/trendy?${queryParams.toString()}`;
        const response = await fetch(url, { next: { revalidate: 0 } });
        
        if (!response.ok) {
            throw new Error('Failed to fetch trendy products');
        }
        
        const data = await response.json();

        return {
            ...data,
            products: data.products.map((product: ProductOrProductForHome) => ({
                ...product,
                stock_id: Number(product.stock_id),
                product_id: Number(product.product_id),
                price_by_unit: parseFloat(product.price_by_unit.toString()),
                average_rating: parseFloat(product.average_rating.toString()),
                rating_count: parseInt(product.rating_count.toString(), 10),
                category_image_data: product.category_image_data ? `${IMAGE_BASE_URL}${product.category_image_data}` : undefined,
                variants: product.variants.map(variant => ({
                    ...variant,
                    stock_id: Number(variant.stock_id),
                    product_id: Number(variant.product_id),
                    price_by_unit: Number(variant.price_by_unit)
                }))
            }))
        };
    } catch (error) {
        console.error('Error fetching trendy products:', error);
        throw error;
    }
});

/**
 * Obtiene los productos con descuento
 * @param params - Objeto con parámetros de consulta (page, limit)
 * @returns Promise con la lista de productos con descuento
 */
export const getDiscountProducts = cache(async (params: ProductListQueryParams = {}): Promise<ProductsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${API_BASE_URL}/products/public/discount?${queryParams.toString()}`;
        const response = await fetch(url, { next: { revalidate: 0 } });
        
        if (!response.ok) {
            throw new Error('Failed to fetch discount products');
        }
        
        const data = await response.json();

        return {
            ...data,
            products: data.products.map((product: ProductOrProductForHome) => ({
                ...product,
                stock_id: Number(product.stock_id),
                product_id: Number(product.product_id),
                price_by_unit: parseFloat(product.price_by_unit.toString()),
                average_rating: parseFloat(product.average_rating.toString()),
                rating_count: parseInt(product.rating_count.toString(), 10),
                category_image_data: product.category_image_data ? `${IMAGE_BASE_URL}${product.category_image_data}` : undefined,
                variants: product.variants.map(variant => ({
                    ...variant,
                    stock_id: Number(variant.stock_id),
                    product_id: Number(variant.product_id),
                    price_by_unit: Number(variant.price_by_unit)
                }))
            }))
        };
    } catch (error) {
        console.error('Error fetching discount products:', error);
        throw error;
    }
});

/**
 * Obtiene los productos más vendidos
 * @param params - Objeto con parámetros de consulta (page, limit)
 * @returns Promise con la lista de productos más vendidos
 */
export const getBestSellerProducts = cache(async (params: ProductListQueryParams = {}): Promise<BestSellerResponse> => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        const response = await fetch(
            `${API_BASE_URL}/products/public/bestseller?${queryParams.toString()}`,
            { 
                next: { revalidate: 0 },
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch bestseller products');
        }

        const data = await response.json();
        return {
            ...data,
            products: data.products.map((product: BestSellerProduct) => ({
                ...product,
                stock_id: Number(product.stock_id),
                price_by_unit: product.price_by_unit,
                price_fake_discount: product.price_fake_discount,
                precio_final: product.precio_final ? Number(product.precio_final) : null,
                min_qty: Number(product.min_qty),
                total_sold: product.total_sold,
            }))
        };
    } catch (error) {
        console.error('Error fetching bestseller products:', error);
        throw error;
    }
});
