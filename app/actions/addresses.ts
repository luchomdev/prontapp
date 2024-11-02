'use server'

import { cookies } from 'next/headers'


export interface Address {
    id: string;
    city_id: number;
    cityName: string;
    address: string;
    addressComplement: string;
    phone: string;
    default_address?: string;
}
interface AddressPayload {
    city_id: number;
    address: string;
    phone: string;
}

// Obtener todas las direcciones del usuario
export async function fetchAddresses(): Promise<Address[]> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/addresses`, {
            credentials: 'include',
            cache: "no-store",
            headers: {
                'Cookie': cookies().toString() || ''
            }
        });

        if (!response.ok) throw new Error('Failed to fetch addresses');
        return await response.json();
    } catch (error) {
        console.error('Error in fetchAddresses server action:', error);
        return [];
    }
}

// Agregar nueva dirección
export async function addNewAddress(address: Omit<Address, 'id'>): Promise<Address | null> {
    const payload: AddressPayload = {
        city_id: address.city_id,
        address: address.address,
        phone: address.phone
    };
    try {
        //console.log("[Address passed]", address);
        const response = await fetch(`${process.env.API_BASE_URL}/users/address`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies().toString() || ''
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to add address');
        return await response.json();
    } catch (error) {
        console.error('Error in addNewAddress server action:', error);
        return null;
    }
}

// Eliminar dirección
export async function removeAddress(addressId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/address/${addressId}`, {
            method: 'DELETE',
            headers: {
                'Cookie': cookies().toString() || ''
            },
            credentials: 'include'
        });

        return response.ok;
    } catch (error) {
        console.error('Error in removeAddress server action:', error);
        return false;
    }
}

// Establecer dirección por defecto
export async function setDefaultAddress(addressId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/address/${addressId}/set-default`, {
            method: 'PATCH',
            headers: {
                'Cookie': cookies().toString() || ''
            },
            credentials: 'include'
        });

        return response.ok;
    } catch (error) {
        console.error('Error in setDefaultAddress server action:', error);
        return false;
    }
}