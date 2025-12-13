"use client"
import Logo from '@/app/(admin)/components/Logo';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useHydration } from '@/hooks/useHydration';
import { signIn } from '@/app/(admin)/actions/auth';

interface SigninFormProps {
  initialEmail?: string;
  onSuccess?: () => void;
  onBack?: () => void;        // volver a cambiar correo
  onGoRegister?: () => void;  // ir a registro si quiere
  lockEmail?: boolean;        // si quieres bloquear el input cuando viene del checkout
}

const SigninForm: React.FC<SigninFormProps> = ({
  initialEmail = '',
  onSuccess,
  onBack,
  onGoRegister,
  lockEmail = true,
}) => {
  const hydrated = useHydration();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setUser, setAuthenticated } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated
  }));

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, complete todos los campos');
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

      // ✅ Si lo estás usando dentro del checkout modal, avanza de paso (no redirecciones)
      if (onSuccess) {
        onSuccess();
        return;
      }

      // ✅ Comportamiento original (pantalla de login normal)
      if (result.user.role === 'admin') router.replace('/console/dashboard');
      else router.replace('/');

    } catch (error) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hydrated) return <div>Espere ...</div>;

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mx-2">
      <div className='flex justify-center'>
        <Logo />
      </div>

      <h2 className="text-xl font-semibold mb-6 text-center text-slate-800">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
            required
            disabled={isLoading || (lockEmail && !!initialEmail)}
            readOnly={lockEmail && !!initialEmail}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 pr-10"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
            >
              {showPassword
                ? <FaEyeSlash className="h-4 w-4 text-gray-400" />
                : <FaEye className="h-4 w-4 text-gray-400" />
              }
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-slate-600 text-white text-xs font-medium py-2 px-4 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              Cargando...
            </span>
          ) : (
            'Iniciar sesión'
          )}
        </button>

        {/* Opcionales para el flujo del checkout */}
        {(onBack || onGoRegister) && (
          <div className="mt-4 flex items-center justify-between text-xs">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="text-slate-600 hover:underline"
                disabled={isLoading}
              >
                Usar otro correo
              </button>
            ) : <span />}

            {onGoRegister ? (
              <button
                type="button"
                onClick={onGoRegister}
                className="text-orange-600 hover:underline"
                disabled={isLoading}
              >
                Registrarme
              </button>
            ) : <span />}
          </div>
        )}
      </form>
    </div>
  );
};

export default SigninForm;
