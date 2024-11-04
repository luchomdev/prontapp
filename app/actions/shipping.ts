'use server'

import { cookies } from 'next/headers'

interface ShippingQuotation {
  shipping_value: number;
  courier_id: number;
  courier_name: string;
}

interface ShippingQuoteResponse {
  status: string;
  quotations: ShippingQuotation[];
}

export async function getShippingQuote(
  stockIds: number[], 
  cityTo: number,
  payment: number
): Promise<number | null> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/shipping/quote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies().toString() || ''
        },
        body: JSON.stringify({
          stock_ids: stockIds,
          city_to: cityTo,
          payment
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch shipping estimate');
    }

    const data: ShippingQuoteResponse = await response.json();
    
    if (data.status === 'success' && data.quotations.length > 0) {
      return data.quotations[0].shipping_value;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getShippingQuote server action:', error);
    return null;
  }
}