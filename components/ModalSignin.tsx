"use client"
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import SigninForm from '@/components/auth/SigninForm';

interface ModalSignInProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalSignIn: React.FC<ModalSignInProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState(0); // Para forzar el re-render del formulario

  if (!isOpen) return null;

  const handleClose = () => {
    setKey(prev => prev + 1); // Esto forzará un re-render del SigninForm, reseteando sus campos
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 m-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Iniciar Sesión</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <SigninForm key={key} onSuccess={handleClose} />
        <p className="text-center">
          ¿No tienes una cuenta?{' '}
          <Link onClick={handleClose} href="/register" className="text-orange-500 hover:text-orange-600">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ModalSignIn;