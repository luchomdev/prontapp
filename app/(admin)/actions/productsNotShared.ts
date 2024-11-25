'use server'

import { cookies } from 'next/headers'
import { MegaProduct } from '@/app/(admin)/actions/megabodega'

interface FilterParams {
    search: string;
    stockID: string;
    sortBy: string;
}

interface ProductsNotSharedResponse {
    data: MegaProduct[];
    last_page: number;
}

export async function fetchProductsNotSharedServer(
    page: number,
    filterParams: FilterParams
): Promise<ProductsNotSharedResponse> {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            ...filterParams
        });

        const response = await fetch(
            `${process.env.API_BASE_URL}/products/hoko-not-share-products?${queryParams}`,
            {
                credentials: 'include',
                headers: {
                    'Cookie': cookies().toString() || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch not shared products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchProductsNotSharedServer:', error);
        throw error;
    }
}

export async function importProductNotSharedServer(product: MegaProduct): Promise<boolean> {
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
        console.error('Error in importProductNotSharedServer:', error);
        throw error;
    }
}