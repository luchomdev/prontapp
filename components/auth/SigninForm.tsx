"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/stores/cartStore';
import { validateEmail } from '@/lib/validator'
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SigninFormProps {
  onSuccess?: () => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSuccess }) => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setAuthenticated, setShippingAddress } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    setShippingAddress: state.setShippingAddress
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, ingrese un email válido.');
      return;
    }

    if (password.trim() === '') {
      setError('La contraseña no puede estar vacía.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setUser(data.user);
      setAuthenticated(true);
      
      // Asignar la dirección por defecto al estado global
      if (data.user.defaultAddress) {
        const addressParts = data.user.defaultAddress.address.split('~');
        const address = addressParts[0].trim();
        const addressComplement = addressParts[1] ? addressParts[1].trim() : '';
        
        setShippingAddress({
          city_id: data.user.defaultAddress.city_id,
          cityName: data.user.defaultAddress.cityName,
          address: address,
          addressComplement: addressComplement
        });
      }

      // Redirección basada en el rol del usuario
      if (data.user.role === 'admin') {
        router.replace("/console/dashboard");
      } else {
        router.replace("/");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setError('Credenciales inválidas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form name='SigninForm' onSubmit={handleSubmit}>
      <input
        name='email'
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <div className="relative">
        <input
          name='password'
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded pr-10"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 -top-3 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Link onClick={onSuccess} href="/request-password-recovery" className="flex items-center justify-end text-sm text-blue-600 hover:underline mb-4">
        ¿Olvidaste tu contraseña?
      </Link>
      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 mb-4 disabled:bg-orange-300"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default SigninForm;