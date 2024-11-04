'use server'

import { cookies } from 'next/headers'

interface GuideHistory {
    created_at: string;
    description: string;
}

interface OrderGuide {
    id: string;
    guide_state_description: string;
    guide_histories: GuideHistory[];
}

interface OrderResponse {
    orders: OrderGuide[];
}

interface Order {
    order_id: number;
    delivery_state_description: string;
    customer: {
        name: string;
        email: string;
    };
    stocks: {
        [key: string]: {
            amount: number;
            price: number;
        }
    };
    created_at: string;
}

interface OrdersResponse {
    orders: Order[];
    totalOrders: number;
}

interface OrderDetail {
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

interface CustomerData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city_id: string;
    identification: string;
    ciudadText?: string;
  }

export async function fetchOrderGuide(orderId: string): Promise<OrderGuide | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders?order_id=${orderId}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                cache: 'no-store' // Aseguramos obtener datos frescos
            }
        );

        if (!response.ok) throw new Error('Failed to fetch order data');

        const data: OrderResponse = await response.json();

        if (data.orders && data.orders.length > 0) {
            return data.orders[0];
        }

        return null;
    } catch (error) {
        console.error('Error in fetchOrderGuide server action:', error);
        return null;
    }
}


export async function fetchOrders(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    orderId?: string
): Promise<OrdersResponse | null> {
    try {
        let url = `${process.env.API_BASE_URL}/orders?page=${page}&limit=${limit}`;

        if (startDate && endDate) {
            url += `&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
        }
        if (orderId) {
            url += `&order_id=${orderId}`;
        }

        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                'Cookie': cookies().toString() || ''
            },
            cache: 'no-store' // Para asegurar datos frescos
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        return {
            orders: data.orders,
            totalOrders: data.totalOrders
        };
    } catch (error) {
        console.error('Error in fetchOrders server action:', error);
        return null;
    }
}

export async function fetchOrderDetail(orderId: string): Promise<OrderDetail | null> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders?order_id=${orderId}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                },
                cache: 'no-store' // Aseguramos datos frescos
            }
        );

        if (!response.ok) throw new Error('Failed to fetch order details');

        const data = await response.json();

        if (data.orders && data.orders.length > 0) {
            return data.orders[0];
        }

        return null;
    } catch (error) {
        console.error('Error in fetchOrderDetail server action:', error);
        return null;
    }
}
// cancel order
export async function cancelOrder(orderId: number): Promise<boolean> {
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

        return response.ok;
    } catch (error) {
        console.error('Error in cancelOrder server action:', error);
        return false;
    }
}

export async function updateOrderAddress(
    orderId: string,
    customerData: CustomerData
): Promise<boolean> {
    try {
        console.log("[Customer data on updateOrderAddress ]",customerData)
        const { ciudadText, ...customerDataWithoutCityText } = customerData;
        const response = await fetch(
            `${process.env.API_BASE_URL}/orders/${orderId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify({
                    customer: customerDataWithoutCityText
                })
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error in updateOrderAddress server action:', error);
        return false;
    }
}

export async function submitRating(
    productId: string,
    orderId: string,
    rating: number,
    comment: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/rating`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    orderId,
                    rating: rating.toString(),
                    comment
                })
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error in submitRating server action:', error);
        return false;
    }
}