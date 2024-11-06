'use server'

import { cookies } from 'next/headers'

export interface Product {
  id: string;
  name: string;
  stock_id: string;
  product_id: string;
  amount: number;
  price_by_unit: number | string | null;
  price_dropshipping: number | string;
  images: string;
  merge_by: string | null;
  discount: number | string | null;
  precio_final: number | string | null;
  category_name: string;
  average_rating: number | string | null;
  rating_count: number | string;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
}

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  level?: number;
}

export interface Rating {
  id: string;
  product_name: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export interface RatingsResponse {
  ratings: Rating[];
  totalRatings: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Obtener productos con filtros y paginación
export async function fetchProductsServer(
  page: number,
  limit: number,
  stockId?: string | null,
  search?: string,
  categoryId?: string | null
): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(stockId && { stockId }),
      ...(search && { search }),
      ...(categoryId && { category_id: categoryId }),
    });

    const response = await fetch(
      `${process.env.API_BASE_URL}/products?${queryParams}`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error(response.status === 401 ? '401' : 'Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchProductsServer server action:', error);
    throw error;
  }
}

// Obtener todas las categorías para el filtro
export async function fetchCategoriesServer(): Promise<Category[]> {
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
      throw new Error(response.status === 401 ? '401' : 'Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error in fetchCategoriesServer server action:', error);
    throw error;
  }
}

// Agrupar productos
export async function mergeProductsServer(productIds: string[]): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/products/merge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include',
        body: JSON.stringify({ productIds })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to merge products');
    }

    return true;
  } catch (error) {
    console.error('Error in mergeProductsServer server action:', error);
    throw error;
  }
}


export async function fetchPendingRatingsServer(page: number): Promise<RatingsResponse> {
  try {
      const response = await fetch(
          `${process.env.API_BASE_URL}/rating/moderate?page=${page}`,
          {
              credentials: 'include',
              headers: {
                  'Cookie': cookies().toString() || ''
              }
          }
      );

      if (!response.ok) {
          throw new Error('Failed to fetch ratings');
      }

      return await response.json();
  } catch (error) {
      console.error('Error in fetchPendingRatingsServer:', error);
      throw error;
  }
}

export async function approveRatingServer(ratingId: string): Promise<boolean> {
  try {
      const response = await fetch(
          `${process.env.API_BASE_URL}/rating/${ratingId}/approve`,
          {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                  'Cookie': cookies().toString() || ''
              }
          }
      );

      if (!response.ok) {
          throw new Error('Failed to approve rating');
      }

      return true;
  } catch (error) {
      console.error('Error in approveRatingServer:', error);
      throw error;
  }
}