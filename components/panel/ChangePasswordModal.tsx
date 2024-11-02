"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/cartStore';
import Toaster from '@/components/Toaster';
import { changePassword } from '@/app/actions/users';

interface ChangePasswordModalProps {
  onClose: () => void;
  userId: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const { logout } = useStore((state) => ({
    logout: state.logout
  }));

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden');
      setToastType('error');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setToastMessage('La contraseña no cumple con los requisitos de seguridad');
      setToastType('error');
      return;
    }

    setIsChanging(true);
    try {
      const result = await changePassword(userId, newPassword);
      
      if (result.success) {
        setToastMessage(result.message);
        setToastType('success');
        
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        setToastMessage(result.message);
        setToastType('error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setToastMessage('Error al cambiar la contraseña');
      setToastType('error');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mx-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">Cambiar Contraseña</h3>
        <p className="text-sm text-gray-600 mb-4">
          Por favor, crea una contraseña segura que incluya al menos 8 caracteres, 
          combinando mayúsculas, minúsculas, números y símbolos para mayor seguridad.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block mb-1">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">Repite Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
              minLength={8}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isChanging || !validatePassword(newPassword) || newPassword !== confirmPassword}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${(isChanging || !validatePassword(newPassword) || newPassword !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChanging ? 'Cambiando...' : 'Cambiar'}
            </button>
          </div>
        </form>
      </div>
      {toastMessage && (
        <Toaster
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ChangePasswordModal;