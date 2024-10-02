'use client';

import { useEffect } from 'react';
import { useStore } from '@/stores/cartStore';

export function AuthInitializer() {
  const { setAuthenticated, setUser, setLoading } = useStore((state) => ({
    setAuthenticated: state.setAuthenticated,
    setUser: state.setUser,
    setLoading: state.setLoading
  }));

  useEffect(() => {
    async function initializeAuth() {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-auth`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        setAuthenticated(data.isAuthenticated);
        setUser(data.user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return null;
}