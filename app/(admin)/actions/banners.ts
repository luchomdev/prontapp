'use server'

import { cookies } from 'next/headers'

export interface Banner {
  id: string;
  title: string;
  link: string;
  order_index: number;
  is_active: boolean;
  platform: 'web' | 'mobile';
  image_data: string;
}


interface BannersResponse {
  banners: Banner[];
  totalPages: number;
}

// Obtener lista de banners paginada
export async function fetchBannersServer(page: number): Promise<BannersResponse> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/banners/admin?page=${page}`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchBannersServer:', error);
    throw error;
  }
}

// Obtener un banner específico
export async function fetchBannerByIdServer(bannerId: string): Promise<Banner> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/banners/admin/${bannerId}`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch banner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchBannerByIdServer:', error);
    throw error;
  }
}

// Crear un nuevo banner
export async function createBannerServer(formData: FormData): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/banners/`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include'
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error in createBannerServer:', error);
    throw error;
  }
}

// Actualizar un banner existente
export async function updateBannerServer(
  bannerId: string,
  formData: FormData
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/banners/${bannerId}`,
      {
        method: 'PUT',
        body: formData,
        headers: {
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include'
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error in updateBannerServer:', error);
    throw error;
  }
}

// Cambiar estado activo/inactivo de un banner
export async function toggleBannerActiveServer(bannerId: string): Promise<Banner> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/banners/${bannerId}/toggle`,
      {
        method: 'PATCH',
        headers: {
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to toggle banner status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in toggleBannerActiveServer:', error);
    throw error;
  }
}