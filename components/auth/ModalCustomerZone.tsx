"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {useRouter} from "next/navigation"
import { useStore } from '@/stores/cartStore';
import { FaTimes, FaUser, FaShoppingBag, FaMapMarkerAlt, FaBell, FaTruck, FaRobot, FaSignOutAlt } from 'react-icons/fa';

interface ModalCustomerZoneProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const Avatar = ({ name }: { name: string }) => (
  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
    {name.charAt(0).toUpperCase()}
  </div>
);

const ModalCustomerZone: React.FC<ModalCustomerZoneProps> = ({ anchorEl, onClose }) => {
  const [modalStyle, setModalStyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useStore((state) => ({
    user: state.user,
    logout: state.logout
  }));

  useEffect(() => {
    if (anchorEl && modalRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = anchorRect.left + window.scrollX - modalRect.width / 2 + anchorRect.width / 2;
      let top = anchorRect.bottom + window.scrollY + 10;
      let arrowLeft = '50%';

      // Ajuste horizontal
      if (left < 10) {
        arrowLeft = `${anchorRect.left + anchorRect.width / 2 - left - 10}px`;
        left = 10;
      } else if (left + modalRect.width > viewportWidth - 10) {
        left = viewportWidth - modalRect.width - 10;
        arrowLeft = `${anchorRect.left + anchorRect.width / 2 - left - 10}px`;
      }

      // Ajuste vertical
      if (top + modalRect.height > viewportHeight - 10) {
        top = anchorRect.top - modalRect.height - 10;
        setArrowStyle({
          bottom: '-8px',
          transform: 'rotate(180deg)',
          left: arrowLeft,
        });
      } else {
        setArrowStyle({
          top: '-8px',
          left: arrowLeft,
        });
      }

      setModalStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  }, [anchorEl]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      
      // Si la respuesta es satisfactoria, procedemos con el logout en el cliente
      logout();
      onClose();
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div
        ref={modalRef}
        className="bg-white shadow-lg rounded-lg p-4 w-64 z-50 absolute"
        style={modalStyle as React.CSSProperties}
      >
        <div
          className="absolute w-4 h-4 bg-white transform rotate-45"
          style={arrowStyle as React.CSSProperties}
        ></div>
        <div className="relative">
          <button onClick={onClose} className="absolute top-0 right-0 text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
          <div className="flex items-center mb-4">
            <Avatar name={user?.name || ''} />
            <span className="ml-3 font-semibold">{user?.name}</span>
          </div>
          <nav className="space-y-2">
            <Link onClick={onClose} href="/panel/account" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaUser className="mr-2" />
              Mi Cuenta
            </Link>
            <Link onClick={onClose} href="/panel/orders" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaShoppingBag className="mr-2" />
              Pedidos
            </Link>
            <Link onClick={onClose} href="/panel/addresses" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaMapMarkerAlt className="mr-2" />
              Direcciones
            </Link>
            {/* <Link onClick={onClose} href="/panel/notifications" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaBell className="mr-2" />
              Notificaciones
            </Link> */}
            <Link onClick={onClose} href="/panel/guide-tracking" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaTruck className="mr-2" />
              Seguimiento de guías
            </Link>
            <Link onClick={onClose} aria-disabled href="/" className="flex items-center text-gray-700 hover:text-orange-500">
              <FaRobot className="mr-2" />
              Soporte IA
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 flex items-center justify-center ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaSignOutAlt className="mr-2" />
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalCustomerZone;