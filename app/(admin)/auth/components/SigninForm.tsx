"use client"
import Logo from '@/app/(admin)/components/Logo';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import Toaster from '@/components/Toaster';
import { useHydration } from '@/hooks/useHydration';

const SigninForm: React.FC = () => {
    const hydrated = useHydration();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setAuthenticated } = useStore((state) => ({
        setUser: state.setUser,
        setAuthenticated: state.setAuthenticated
    }));
    const router = useRouter();
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setToasterMessage('Por favor, complete todos los campos');
            setToasterType('error');
            setShowToaster(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setAuthenticated(true);
                setToasterMessage('Inicio de sesión exitoso');
                setToasterType('success');
                setShowToaster(true);


                if (data.user.role === 'admin') {
                    router.replace('/console/dashboard');
                } else {
                    router.replace('/');
                }

            } else {
                setToasterMessage(data.message || 'Error al iniciar sesión');
                setToasterType('error');
                setShowToaster(true);
            }
        } catch (error) {
            setToasterMessage('Error al conectar con el servidor');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!hydrated) {
        return <div>Espere ...</div>;
    }

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mx-2">
            {showToaster && (
                <Toaster
                    message={toasterMessage}
                    type={toasterType}
                    onClose={() => setShowToaster(false)}
                />
            )}
            <div className='flex justify-center'>
                <Logo />
            </div>

            <h2 className="text-xl font-semibold mb-6 text-center text-slate-800">Consola iniciar sesión</h2>
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
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-6">
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
                            {showPassword ? <FaEyeSlash className="h-4 w-4 text-gray-400" /> : <FaEye className="h-4 w-4 text-gray-400" />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-slate-600 text-white text-xs font-medium py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </form>
        </div>
    );
};

export default SigninForm;