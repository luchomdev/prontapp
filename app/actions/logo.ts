'use server'

export async function getLogoUrl() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/logo/url`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store' // no cachear la respuesta
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.logoUrl;
  } catch (error) {
    console.error('Error fetching logo:', error);
    throw error;
  }
}