"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/stores/cartStore';
import { validateEmail } from '@/lib/validator'
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signIn } from '@/app/actions/signin';

interface SigninFormProps {
  onSuccess?: () => void;
  initialEmail?: string;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, initialEmail = '' }) => {
  const router = useRouter()
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser, setAuthenticated, setShippingAddress } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    setShippingAddress: state.setShippingAddress
  }));

  // Actualizar email cuando cambia initialEmail
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

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
      const result = await signIn(email, password);

      if (!result.success || !result.user) {
        setError(result.error || 'Error al iniciar sesión');
        return;
      }

      setUser(result.user);
      setAuthenticated(true);
      
      if (result.user.defaultAddress) {
        const [address, city_id, cityName] = result.user.defaultAddress.split('|~');
        const [baseAddress, complement] = address.split('~');
        
        setShippingAddress({
          city_id: parseInt(city_id),
          cityName: cityName,
          address: baseAddress.trim(),
          addressComplement: complement ? complement.trim() : ''
        });
      }

      if (onSuccess) {
        onSuccess();
      } else if (result.user.role === 'admin') {
        router.replace("/console/dashboard");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setError('Error al intentar iniciar sesión. Por favor, intente de nuevo.');
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
        readOnly={!!initialEmail}
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