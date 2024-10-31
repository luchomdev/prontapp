'use client';

import { useEffect } from 'react';
import { useStore } from '@/stores/cartStore';
import { checkAuth } from '@/app/actions/auth';

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
        const { isAuthenticated, user } = await checkAuth();
        
        setAuthenticated(isAuthenticated);
        setUser(user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, [setAuthenticated, setUser, setLoading]);

  return null;
}