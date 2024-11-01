'use server'

import { cookies } from "next/headers";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    identification: string;
    defaultAddress: string | null;
}

interface AuthResponse {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export async function checkAuth(): Promise<AuthResponse> {
  try {
    // Obtener específicamente la cookie token
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    console.log('Token cookie:', token); // Para debug

    const response = await fetch(`${process.env.API_BASE_URL}/users/check-auth`, {
      credentials: 'include',
      headers: {
        'Cookie': cookies().toString(),
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      isAuthenticated: data.isAuthenticated,
      user: data.user
    };
  } catch (error) {
    console.error('Error in checkAuth server action:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/users/signout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': cookies().toString(),
      }
    });

    if (!response.ok) {
      throw new Error('Failed to sign out');
    }

    // Limpiar la cookie token
    cookies().delete('token');
    
    return { success: true };
  } catch (error) {
    console.error('Error in signout server action:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al cerrar sesión' 
    };
  }
}