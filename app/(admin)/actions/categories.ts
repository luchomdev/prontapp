'use server'

import { cookies } from 'next/headers'

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    slug: string;
    is_active: boolean;
    image_type: string | null;
    image_data: string | null;
    level?: number;
    path?: string;
}

interface PaginatedResponse {
  categories: Category[];
  total: number;
}

// Obtener categorías con paginación y búsqueda
export async function fetchCategories(page: number, limit: number, search?: string): Promise<PaginatedResponse> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/categories/admin?page=${page}&limit=${limit}&search=${search || ''}`,
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

    return await response.json();
  } catch (error) {
    console.error('Error in fetchCategories server action:', error);
    throw error;
  }
}

// Obtener todas las categorías para el select de categoría padre
export async function fetchAllCategories(): Promise<Category[]> {
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
      throw new Error('Failed to fetch all categories');
    }

    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error in fetchAllCategories server action:', error);
    throw error;
  }
}

// Obtener detalles de una categoría específica
export async function fetchCategoryDetails(categoryId: string): Promise<Category> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/categories/admin?category_id=${categoryId}`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch category details');
    }

    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error('Error in fetchCategoryDetails server action:', error);
    throw error;
  }
}

// Crear o actualizar categoría
export async function saveCategory(
  formData: FormData,
  categoryId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const url = categoryId 
      ? `${process.env.API_BASE_URL}/categories/${categoryId}`
      : `${process.env.API_BASE_URL}/categories`;

    const response = await fetch(url, {
      method: categoryId ? 'PUT' : 'POST',
      body: formData,
      headers: {
        'Cookie': cookies().toString() || ''
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Error al guardar la categoría'
      };
    }

    return {
      success: true,
      message: 'Categoría guardada exitosamente'
    };
  } catch (error) {
    console.error('Error in saveCategory server action:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor'
    };
  }
}