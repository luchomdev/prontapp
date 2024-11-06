'use server'

import { cookies } from 'next/headers'

export interface CustomerInfo {
    identification: string | null;
    phone: string | null;
    address: string | null;
    cityId: number | null;
    cityText: string | null;
}

export interface City {
    city_id: number;
    name: string;
}

export interface UserListItem {
    id: string;
    name: string;
    last_name: string;
    email: string;
    user_role: string;
    is_active: boolean;
}

export interface UserForEdit {
    id: string;
    name: string;
    lastName: string;
    email: string;
    userRole: string;
    isActive: boolean;
    customerInfo: CustomerInfo;
}

interface UsersResponse {
    users: UserListItem[];
    limit: number;
}

interface CreateUserData {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

interface UpdateUserData {
    name: string;
    lastName: string;
    email: string;
    identification?: string;
    phone?: string;
    address?: string;
    city_id?: string | number;
}

// Obtener lista de usuarios con búsqueda y paginación
export async function fetchUsersServer(
    page: number,
    search?: string
): Promise<UsersResponse> {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            ...(search && { search })
        });

        const response = await fetch(
            `${process.env.API_BASE_URL}/users?${queryParams}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchUsersServer:', error);
        throw error;
    }
}

// Obtener detalles de un usuario específico
export async function fetchUserDetailsServer(userId: string): Promise<UserForEdit> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/users/${userId}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchUserDetailsServer:', error);
        throw error;
    }
}

// Crear nuevo usuario
export async function createUserServer(
    userData: CreateUserData
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/users/admin`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Error al crear el usuario'
            };
        }

        return {
            success: true,
            message: 'Usuario creado exitosamente'
        };
    } catch (error) {
        console.error('Error in createUserServer:', error);
        return {
            success: false,
            message: 'Error al conectar con el servidor'
        };
    }
}

// Actualizar usuario existente
export async function updateUserServer(
    userId: string,
    userData: UpdateUserData
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/users/${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Error al actualizar el usuario'
            };
        }

        return {
            success: true,
            message: 'Usuario actualizado exitosamente'
        };
    } catch (error) {
        console.error('Error in updateUserServer:', error);
        return {
            success: false,
            message: 'Error al conectar con el servidor'
        };
    }
}

// Activar/Desactivar usuario
export async function toggleUserActiveServer(userId: string): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/users/${userId}/toggle-active`,
            {
                method: 'PATCH',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include'
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error in toggleUserActiveServer:', error);
        throw error;
    }
}

// Buscar ciudades
export async function searchCitiesServer(searchTerm: string): Promise<City[]> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/locations/search-cities?search=${searchTerm}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search cities');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in searchCitiesServer:', error);
        return [];
    }
}