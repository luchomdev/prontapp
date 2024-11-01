'use server'

export async function fetchDocContent(docType: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/config/public?vars=${docType}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    const data = await response.json();
    return data[docType] || '';
  } catch (error) {
    console.error('Error fetching doc content:', error);
    return 'Error loading content';
  }
}