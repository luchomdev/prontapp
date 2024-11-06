'use server'

import { cookies } from 'next/headers'

export interface MegaProduct {
    id: string;
    name: string;
    product_id: string;
    cellar_id: number;
    reference: string;
    amount: number;
    price_by_unit: number | string | null;
    price_dropshipping: number | string;
    images: string;
    discount: number | string | null;
    description: string;
    measures: string;
    video: string;
    warranty: string;
}

interface FilterParams {
    search: string;
    stockID: string;
    groupByStockID: string;
    sortBy: string;
}

interface MegaBodegaResponse {
    data: MegaProduct[];
    last_page: number;
}

export async function fetchMegaProductsServer(
    page: number,
    filterParams: FilterParams
): Promise<MegaBodegaResponse> {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            ...filterParams
        });

        const response = await fetch(
            `${process.env.API_BASE_URL}/products/hoko-products?${queryParams}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch mega products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchMegaProductsServer:', error);
        throw error;
    }
}

export async function importMegaProductServer(product: MegaProduct): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/products/import-hoko-products`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies().toString() || ''
                },
                credentials: 'include',
                body: JSON.stringify({ products: [product] })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to import product');
        }

        return true;
    } catch (error) {
        console.error('Error in importMegaProductServer:', error);
        throw error;
    }
}