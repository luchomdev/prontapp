'use server'

import { cookies } from "next/headers"

interface CustomerInfo {
    identification: string | null;
    phone: string | null;
    address: string | null;
    cityId: number | null;
    cityText: string | null;
}

interface UserData {
    id: string;
    name: string;
    lastName: string;
    email: string;
    createdAt: string;
    userRole: string;
    isActive: boolean;
    customerInfo: CustomerInfo;
}

export async function fetchUserDetails(userId: string): Promise<UserData | null> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/${userId}`, {
            credentials: 'include',
            headers: {
                'Cookie': cookies().toString() || ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in fetchUserDetails server action:', error);
        return null;
    }
}