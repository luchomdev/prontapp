'use server'

import { headers } from 'next/headers';
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

interface RegisterData {
  identification: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleName: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
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

// Actualizar la interfaz de respuesta para incluir el usuario
interface SignUpResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export async function signUpServer(userData: RegisterData): Promise<SignUpResponse> {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Mozilla/5.0';

    const response = await fetch(
      `${process.env.API_BASE_URL}/users/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al registrar el usuario'
      };
    }

    // Manejar la cookie de autenticación
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const tokenCookie = setCookieHeader.split(';')[0];
      const [cookieName, cookieValue] = tokenCookie.split('=');
      
      cookies().set({
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }

    // Mapear el usuario al formato esperado
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      lastName: data.user.lastName,
      role: data.user.role,
      identification: data.user.identification,
      defaultAddress: null // Usuario nuevo no tiene dirección por defecto
    };

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user
    };
  } catch (error) {
    console.error('Error in signUpServer:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor'
    };
  }
}

export async function validateEmailExists(email: string): Promise<{ exists: boolean, error?: string }> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al validar el email');
    }

    const data = await response.json();
    return { exists: data.exists };
  } catch (error) {
    console.error('Error in validateEmailExists:', error);
    return {
      exists: false,
      error: 'Error al verificar el email'
    };
  }
}