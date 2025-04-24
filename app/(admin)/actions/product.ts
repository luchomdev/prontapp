'use server'

import { cookies } from 'next/headers'

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    level?: number;
}

export interface Product {
    id: string;
    stock_id: number;
    cellar_id: number;
    discount: number | null;
    amount: number;
    name: string;
    description: string;
    reference: string;
    minimal_price: string;
    price_dropshipping: string;
    price_by_unit: string;
    images: string;
    video: string | null;
    warranty: string;
    measures: string;
    merge_by: string | null;
    category_id: string | null;
    min_qty: number;
    seo_keywords: string | null;
    seo_description: string | null;
    seo_slug: string | null;
    average_rating: string;
    rating_count: string;
}

interface ProductUpdateData {
  name: string;
  description: string;
  category_id: string | null;
  discount: number | null;
  min_qty: number;
  seo_keywords: string | null;
  seo_description: string | null;
  seo_slug: string | null;
  amount: number;
  price_by_unit: string;
  minimal_price: string;
}

// Obtener detalles de un producto específico
export async function fetchProductDetailServer(productId: string): Promise<Product> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/products/${productId}`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchProductDetailServer server action:', error);
    throw error;
  }
}

// Obtener categorías para el selector
export async function fetchProductCategoriesServer(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/categories/admin?limit=1000`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error in fetchProductCategoriesServer server action:', error);
    throw error;
  }
}

// Actualizar producto
export async function updateProductServer(productId: string, productData: ProductUpdateData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/products/${productId}/adjust`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to update product'
      };
    }

    return {
      success: true,
      message: 'Producto actualizado con éxito'
    };
  } catch (error) {
    console.error('Error in updateProductServer server action:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor'
    };
  }
}