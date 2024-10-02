"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/panel/PageTitle';
import BasicInformation from '@/components/panel/BasicInformation';
import ChangePasswordSection from '@/components/panel/ChangePasswordSection';
import AccountPageSkeleton from '@/components/panel/skeletons/SkeletonAccountPage';
import { useStore } from '@/stores/cartStore';

const AccountPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, setUser } = useStore((state) => ({
    user: state.user,
    setUser: state.setUser
  }));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-auth`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const userData = await response.json();
        setUser(userData.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router, setUser]);

  if (isLoading) {
    return <AccountPageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Mis datos" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BasicInformation user={user} />
        {user && user.id && <ChangePasswordSection userId={user.id} />}
      </div>
    </div>
  );
};

export default AccountPage;