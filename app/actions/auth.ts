'use server'

import { headers } from "next/headers";

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
    const response = await fetch(`${process.env.API_BASE_URL}/users/check-auth`, {
      credentials: 'include',
      headers: {
        'Cookie': headers().get('cookie') || '', // Pasar cookies del cliente al servidor
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