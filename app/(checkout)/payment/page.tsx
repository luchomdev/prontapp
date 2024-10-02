import React, { Suspense } from 'react';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import PaymentContainer from '@/components/PaymentContainer';
import SkeletonPaymentContainer from '@/components/skeletons/SkeletonPaymentContainer';

async function getEpaycoToken() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const response = await fetch(`${process.env.API_BASE_URL}/epayco/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token?.value}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch ePayco token');
  }
  
  const data = await response.json();
  return data.token;
}

async function getUserAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const response = await fetch(`${process.env.API_BASE_URL}/users/check-auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token?.value}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user authentication');
  }
  
  return await response.json();
}

export default async function PaymentPage() {
  
  try {
    
    const [epaycoToken, userAuth] = await Promise.all([getEpaycoToken(), getUserAuth()]);
    if (!userAuth.isAuthenticated) {
      redirect('/signin');
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Realizar Pago</h1>
        <Suspense  fallback={<SkeletonPaymentContainer />}>
          <PaymentContainer epaycoToken={epaycoToken} user={userAuth.user} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    // Aquí puedes manejar el error como prefieras, por ejemplo redirigiendo a una página de error
    redirect('/error');
  }
}