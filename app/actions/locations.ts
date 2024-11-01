'use server'

interface City {
    city_id: number;
    name: string;
}

export async function searchCities(search: string): Promise<City[]> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/locations/search-cities?search=${encodeURIComponent(search)}`,
            { cache: 'no-store' } // Para evitar caché en esta búsqueda
        );

        if (!response.ok) {
            throw new Error('Failed to fetch cities');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in searchCities server action:', error);
        return [];
    }
}