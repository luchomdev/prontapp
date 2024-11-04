'use server'

import { cookies } from 'next/headers'

interface ShippingQuotation {
  stock_ids: number[];
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
): Promise<ShippingQuoteResponse | null> {
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
    return data;
    
  } catch (error) {
    console.error('Error in getShippingQuote server action:', error);
    return null;
  }
}