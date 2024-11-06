"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { FaInfoCircle } from 'react-icons/fa';
import { validateEmail } from '@/lib/validator';
import Toaster from '@/components/Toaster';
import ColFlag from '@/components/ColFlag';
import { signUpServer } from '@/app/actions/auth';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identification: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.identification) newErrors.identification = 'La identificación es requerida';
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone) newErrors.phone = 'El número de móvil es requerido';
    else if (formData.phone.length !== 10) newErrors.phone = 'El número debe tener 10 dígitos';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (!acceptTerms) newErrors.terms = 'Debes aceptar los términos y condiciones';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await signUpServer({
        ...formData,
        roleName: 'normal_user'
      });

      setToastMessage(result.message);
      setToastType(result.success ? 'success' : 'error');
      setShowToast(true);

      if (result.success) {
        setTimeout(() => router.push('/signin'), 3000);
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
      <div className="relative">
        <input
          type="text"
          name="identification"
          value={formData.identification}
          onChange={handleChange}
          placeholder="Identificación"
          className="w-full p-2 border rounded"
          required
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" title="La identificación solo será utilizada para crear las guías del envío" />
        </div>
      </div>
      {errors.identification && <p className="text-red-500 text-sm">{errors.identification}</p>}

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombres"
        className="w-full p-2 border rounded"
        required
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Apellidos"
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ColFlag />
          <span className="text-gray-500">+57</span>
        </div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Móvil"
          className="w-full p-2 pl-20 border rounded"
          required
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" title="Se va a utilizar solo para las notificaciones del estado de tu pedido" />
        </div>
      </div>
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Contraseña"
        className="w-full p-2 border rounded"
        required
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 mr-2"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Al registrarme, acepto los términos y condiciones de uso, la política de privacidad y el tratamiento de mis datos personales para los fines descritos en la política de privacidad.
        </label>
      </div>
      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

      <button 
        type="submit" 
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando...' : 'Registrarse'}
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

export default RegisterForm;