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