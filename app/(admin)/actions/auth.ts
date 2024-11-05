'use server'

import { headers } from 'next/headers';
import { cookies } from 'next/headers';

/* interface SignInResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    isActive: boolean;
    identification: string;
    defaultAddress?: {
      cityId: number;
      address: string;
      phone: string;
    } | null;
  };
  error?: string;
} */

  interface SignInResponse {
    success: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
      lastName: string;
      role: string;
      identification: string;
      defaultAddress: string | null;
    };
    error?: string;
  }

export async function signIn(email: string, password: string): Promise<SignInResponse> {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Mozilla/5.0';

    console.log('Starting admin signin request with:', {
      url: `${process.env.API_BASE_URL}/users/signin`,
      email,
      userAgent
    });

    const response = await fetch(`${process.env.API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await response.json();
    console.log('Response data:', data);

    // Obtener y establecer la cookie del header de respuesta
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('Cookie received:', setCookieHeader);
      
      const tokenCookie = setCookieHeader.split(';')[0];  // "token=value"
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

    if (!response.ok || !data.user) {
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    // Formatear la dirección como string
    const defaultAddress = data.user.defaultAddress 
      ? `${data.user.defaultAddress.address}|~${data.user.defaultAddress.city_id}|~${data.user.defaultAddress.cityName}`
      : null;

    // Mapear el usuario al formato esperado
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      lastName: data.user.lastName,
      role: data.user.role,
      identification: data.user.identification,
      defaultAddress: defaultAddress
    };

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error in admin signin:', error);
    return {
      success: false,
      error: 'Error al intentar iniciar sesión. Por favor, intente de nuevo.'
    };
  }
}