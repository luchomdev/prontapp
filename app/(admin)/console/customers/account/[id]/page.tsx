"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AccountUserCard from '@/app/(admin)/components/Users/AccountUserCard';
import EditAccountForm from '@/app/(admin)/components/Users/EditAccountForm';
import Toaster from '@/components/Toaster';

const AccountPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const showToasterMessage = useCallback((message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        showToasterMessage('Error al cargar los datos del usuario', 'error');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToasterMessage('Error al conectar con el servidor', 'error');
    }
  }, [userId, showToasterMessage]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-auth`, {
        credentials: 'include',
      });
      if (response.ok) {
        const authData = await response.json();
        if (authData.user.id !== userId) {
          showToasterMessage('No tienes permiso para ver esta página', 'error');
          setTimeout(() => router.push('/console/dashboard'), 3000);
        } else {
          await fetchUserData();
        }
      } else {
        showToasterMessage('Error de autenticación', 'error');
        setTimeout(() => router.push('/console/dashboard'), 3000);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      showToasterMessage('Error al verificar la autenticación', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userId, router, showToasterMessage, fetchUserData]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    checkAuth();
  }, [userId, checkAuth]);

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
  };

  const handleSave = () => {
    fetchUserData();
    showToasterMessage('Datos actualizados correctamente', 'success');
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No se pudo cargar la información del usuario</div>;
  }

  return (
    <div className="p-6">
      {showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <button
          onClick={handleEditClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Modificar datos
        </button>
      </div>
      <AccountUserCard user={user} />
      {showEditForm && (
        <EditAccountForm
          user={user}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AccountPage;