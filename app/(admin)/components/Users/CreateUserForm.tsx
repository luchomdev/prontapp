"use client"
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createUserServer } from '@/app/(admin)/actions/users';

interface CreateUserFormProps {
  onClose: () => void;
  showToasterMessage: (message: string, type: 'success' | 'error') => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onClose, showToasterMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, lastName, email, password } = formData;
    setIsFormValid(name.trim() !== '' && lastName.trim() !== '' && email.trim() !== '' && password.trim() !== '');
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createUserServer(formData);
      
      showToasterMessage(result.message, result.success ? 'success' : 'error');
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToasterMessage('Error al conectar con el servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Crear Usuario</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <p className='text-xs mb-3'>Permite crear usuarios administrativos.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;