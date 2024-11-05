'use server'

import { cookies } from 'next/headers'

interface CartItem {
    name: string;
    cantidad: number;
    precio: number;
    thumbnail: string;
    subtotal: number;
    measures: Record<string, string>;
}

interface ShippingQuotation {
    stock_ids: number[];
    shipping_value: number;
    courier_id: number;
    courier_name: string;
}

interface ShippingAddress {
    city_id: number;
    cityName: string;
    address: string;
    addressComplement: string;
}

interface CustomerInfo {
    name: string;
    email: string;
    identification: string;
    phone: string;
    address: string;
    city_id: string;
}

interface TmpOrderPayload {
    cart_content: Record<number, CartItem>;
    shipping_quote: ShippingQuotation[];
    shipping_address: ShippingAddress | null;
    subtotals_value: number;
    total_cart_value: number;
    total_shipping_cost: number;
    customer: CustomerInfo | null;
    payment: string;
    auth_user_id: string;
    auth_user_email: string;
    order_tmp_id: string | null;
}

// Create or update temporary order
export async function createOrUpdateTmpOrderAct(payload: TmpOrderPayload): Promise<{ id: string } | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders/tmp-order`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create or update temporary order');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createOrUpdateTmpOrder server action:', error);
        return null;
    }
}

// Process cash order
export async function processCashOrder(tmpOrderId: string | null): Promise<{ orderIds: string[] } | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders/cash-create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify({ tmp_order_id: tmpOrderId })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create cash order');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in processCashOrder server action:', error);
        return null;
    }
}

// Process Epayco payment
export async function processEpaycoPayment(paymentData: any): Promise<any | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/epayco/process-payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify(paymentData)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to process epayco payment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in processEpaycoPayment server action:', error);
        return null;
    }
}

// Get saved cards
export async function getSavedCards(userId: string, email: string): Promise<any | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/epayco/saved-tcs?user_id=${userId}&email=${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load saved cards');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getSavedCards server action:', error);
        return null;
    }
}