"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Toaster from '@/components/Toaster';
import { useAuthCheck } from "@/hooks/useAuthCheck";

const RecoveryCodeVerificationForm: React.FC = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useAuthCheck(['email']);

  useEffect(() => {
    if (!email) {
      router.push('/request-password-recovery');
    }
  }, [email, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setToastMessage('El código debe tener 6 dígitos');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify code');
      }

      const data = await response.json();
      console.log("DATA response from /users/verify-reset", data)
      setToastMessage('Código verificado correctamente');
      setToastType('success');
      setShowToast(true);

      // Redirigir al usuario a la página de cambio de contraseña
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(data.token)}`);
      }, 3000);

    } catch (error) {
      setToastMessage('Error al verificar el código');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }

      setToastMessage('Se ha enviado un nuevo código de verificación');
      setToastType('success');
      setShowToast(true);
      setTimeLeft(300); // Reiniciar el contador

    } catch (error) {
      setToastMessage('Error al reenviar el código');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="Código de 6 dígitos"
        className="w-full p-2 border rounded"
        required
        maxLength={6}
      />

      <div className="flex items-center space-x-2">
        <div className="flex-grow bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full"
            style={{ width: `${(timeLeft / 300) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 whitespace-nowrap">
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </p>
      </div>

      {timeLeft > 0 ? (
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verificando...' : 'Verificar código'}
        </button>
      ) : (
        <button 
          type="button" 
          onClick={resendCode}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar nuevo código'}
        </button>
      )}

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

export default RecoveryCodeVerificationForm;