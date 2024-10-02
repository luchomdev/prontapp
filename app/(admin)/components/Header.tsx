"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { FaBars, FaChevronDown } from 'react-icons/fa';
import { FcDataConfiguration } from "react-icons/fc";
import Link from 'next/link';
import Logo from '@/app/(admin)/components/Logo';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import Toaster from '@/components/Toaster';
import { useHydration } from '@/hooks/useHydration';

const Header: React.FC = () => {
  const hydrated = useHydration();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleSidebar, user, logout, isAuthenticated, isLoading } = useStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    user: state.user,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading
  }));
  const router = useRouter();
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const checkAuthAndRedirect = useCallback(() => {
    if (hydrated && !isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [hydrated, isLoading, isAuthenticated, router]);

  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  useEffect(() => {
    if (hydrated && !isLoading && isAuthenticated) {
      fetchWalletBalance();
    }
  }, [hydrated, isLoading, isAuthenticated]);



  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/wallet-balance`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance);
      } else {
        console.error('Error fetching wallet balance');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };


  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        logout();
        console.log("Sesión cerrada exitosamente");
        setToasterMessage('Sesión cerrada exitosamente');
        setToasterType('success');
        setShowToaster(true);
        
        setTimeout(() => {
          console.log("Redirigiendo a /auth/signin");
          window.location.href = '/auth/signin';
        }, 100);
      } else {
        setToasterMessage('Error al cerrar sesión');
        setToasterType('error');
        setShowToaster(true);
      }
    } catch (error) {
      setToasterMessage('Error al conectar con el servidor');
      setToasterType('error');
      setShowToaster(true);
    }
  };

  if (!hydrated || isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-slate-200">
      {showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
      <button onClick={toggleSidebar} className="text-slate-600">
        <FaBars size={20} />
      </button>
      <Logo />
      <div className="flex items-center">
        <div className="mr-4 text-sm text-slate-600">
          Disponible Billetera: ${walletBalance}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center text-slate-600 text-sm"
          >
            Hola, {user?.name || 'Usuario'}
            <FaChevronDown className="ml-1" size={12} />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href={`/console/customers/account/${user?.id}`} className="block px-2 py-2 text-xs text-slate-700 hover:bg-slate-100">Mi cuenta</Link>
                <Link onClick={() => setIsMenuOpen(!isMenuOpen)} href={`/console/config`} className="flex items-center space-x-2 px-2 py-2 text-xs text-slate-700 hover:bg-slate-100">
                <FcDataConfiguration size={16} />
                <span>Configuración Global</span>
                </Link>
                <hr className="my-1 border-slate-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-white bg-orange-500 hover:bg-orange-600"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;