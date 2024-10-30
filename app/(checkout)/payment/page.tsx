import React from 'react';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import PaymentContainer from '@/components/PaymentContainer';
import SkeletonPaymentContainer from '@/components/skeletons/SkeletonPaymentContainer';

async function getServerSideData() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/signin');
  }

  try {
    const [epaycoResponse, authResponse] = await Promise.all([
      fetch(`${process.env.API_BASE_URL}/epayco/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token.value}`
        },
      }),
      fetch(`${process.env.API_BASE_URL}/users/check-auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token.value}`
        },
      })
    ]);

    if (!epaycoResponse.ok || !authResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const [epaycoData, userData] = await Promise.all([
      epaycoResponse.json(),
      authResponse.json()
    ]);

    if (!userData.isAuthenticated) {
      redirect('/signin');
    }

    return { epaycoToken: epaycoData.token, user: userData.user };
  } catch (error) {
    console.error('Error fetching server-side data:', error);
    redirect('/error');
  }
}

export default async function PaymentPage() {
  const data = await getServerSideData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Realizar Pago</h1>
      <React.Suspense fallback={<SkeletonPaymentContainer />}>
        <PaymentContainer epaycoToken={data.epaycoToken} user={data.user} />
      </React.Suspense>
    </div>
  );
}