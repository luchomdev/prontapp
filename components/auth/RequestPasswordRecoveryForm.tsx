"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { validateEmail } from '@/lib/validator';
import Toaster from '@/components/Toaster';
import { requestPasswordRecoveryServer } from '@/app/actions/forgotpass';

const RequestPasswordRecoveryForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, ingrese un email válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await requestPasswordRecoveryServer(email);
      setToastMessage(result.message);
      setToastType(result.success ? 'success' : 'error');
      setShowToast(true);

      if (result.success) {
        setTimeout(() => {
          router.push(`/recovery-verify-code?email=${encodeURIComponent(email)}`);
        }, 3000);
      }
    } catch (error) {
      setToastMessage('Error al conectar con el servidor');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full p-2 border rounded"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button 
        type="submit" 
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando...' : 'Solicitar recuperación'}
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

export default RequestPasswordRecoveryForm;