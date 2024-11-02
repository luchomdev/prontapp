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