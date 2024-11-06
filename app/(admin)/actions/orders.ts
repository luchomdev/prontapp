'use server'

import { cookies } from 'next/headers'

export interface Order {
    id: string;
    order_id: number;
    delivery_state: number;
    delivery_state_description: string;
    customer: {
        name: string;
        email: string;
    };
    stocks: {
        [key: string]: {
            amount: number;
            price: number;
            id: string;
            name: string;
            images: Array<{ image: string; url: string }>;
        }
    };
    created_at: string;
    payment: 0 | 1;
    total_shipping_cost: string | null;
}

interface OrdersResponse {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    page: number;
}

interface OrderFilters {
    startDate?: string;
    endDate?: string;
    orderId?: string;
    status?: string;
    paymentMethod?: string;
}

export async function fetchOrdersServer(
    page: number,
    limit: number,
    filters: OrderFilters
): Promise<OrdersResponse> {
    try {
        const url = new URL(`${process.env.API_BASE_URL}/orders`);
        
        // Añadir parámetros base
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());

        // Añadir filtros si existen
        if (filters.startDate) url.searchParams.append('start_date', filters.startDate);
        if (filters.endDate) url.searchParams.append('end_date', filters.endDate);
        if (filters.orderId) url.searchParams.append('order_id', filters.orderId);
        if (filters.status) url.searchParams.append('delivery_state', filters.status);
        if (filters.paymentMethod) url.searchParams.append('payment', filters.paymentMethod);

        const response = await fetch(
            url.toString(),
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                cache: 'no-store' // Para asegurar datos frescos
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchOrdersServer:', error);
        throw error;
    }
}