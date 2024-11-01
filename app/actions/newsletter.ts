'use server'

interface SubscribeResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResponse> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: "",
        last_name: ""
      }),
    });

    if (!response.ok) {
      throw new Error('Subscription failed');
    }

    await response.json();
    
    return {
      success: true,
      message: 'Gracias por el registro a nuestro boletín!'
    };
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    return {
      success: false,
      message: 'Hubo un error. Por favor, intenta de nuevo.'
    };
  }
}