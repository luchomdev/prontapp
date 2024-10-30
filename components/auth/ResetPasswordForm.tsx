"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Toaster from '@/components/Toaster';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useAuthCheck(['email', 'token']);

  useEffect(() => {
    if (!email || !token) {
      router.push('/request-password-recovery');
    }
  }, [email, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, token }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setToastMessage('Contraseña restablecida con éxito');
      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        router.push('/signin');
      }, 3000);

    } catch (error) {
      setToastMessage('Error al restablecer la contraseña');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Repite Contraseña</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
          disabled={!passwordsMatch || isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
        </button>

        {showToast && (
          <Toaster
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </form>
  );
};

export default ResetPasswordForm;