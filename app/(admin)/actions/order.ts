'use server'

import { cookies } from 'next/headers'

export interface OrderDetail {
    order_id: number;
    delivery_state_description: string;
    delivery_state: number;
    created_at: string;
    payment: number;
    customer: any;
    stocks: any;
    total_shipping_cost: string | null;
    id: string;
    guide_state_description: string | null;
    guide_histories: Array<{ created_at: string; description: string }> | null;
    guide_id: number | null;
    last_state: number | null;
}

interface OrderResponse {
    orders: OrderDetail[];
}

// Obtener detalle de una orden específica
export async function fetchOrderDetailServer(orderId: string): Promise<OrderDetail | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders?order_id=${orderId}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        const data: OrderResponse = await response.json();
        return data.orders[0] || null;
    } catch (error) {
        console.error('Error in fetchOrderDetailServer:', error);
        throw error;
    }
}

// Cancelar una orden
export async function cancelOrderServer(orderId: number): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders/${orderId}/cancel`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to cancel order');
        }

        return true;
    } catch (error) {
        console.error('Error in cancelOrderServer:', error);
        throw error;
    }
}