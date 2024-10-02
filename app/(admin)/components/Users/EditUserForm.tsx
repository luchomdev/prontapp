import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface CustomerInfo {
    identification: string | null;
    phone: string | null;
    address: string | null;
    cityId: number | null,
    cityText: string | null;
}
interface UserForEdit {
    id: string;
    name: string;
    lastName: string;
    email: string;
    userRole: string;
    isActive: boolean;
    customerInfo: CustomerInfo
}
interface City {
    city_id: number;
    name: string;
  }

interface EditUserFormProps {
  user: UserForEdit;
  onClose: () => void;
  showToasterMessage: (message: string, type: 'success' | 'error') => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, showToasterMessage }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        identification: user.customerInfo.identification || '',
        phone: user.customerInfo.phone || '',
        address: user.customerInfo.address || '',
        city_id: user.customerInfo.cityId || '',
        cityText: user.customerInfo.cityText || '',
      });
    
      const [isLoading, setIsLoading] = useState(false);
      const [isFormValid, setIsFormValid] = useState(true);
      const [citySearchTerm, setCitySearchTerm] = useState('');
      const [cityResults, setCityResults] = useState<City[]>([]);
      const [showCityResults, setShowCityResults] = useState(false);

  useEffect(() => {
    
    const { name, lastName, email } = formData;
    setIsFormValid(name.trim() !== '' && lastName.trim() !== '' && email.trim() !== '');
  }, [formData]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const searchCities = useCallback(
    debounce(async (term: string) => {
      if (term.length < 3) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/search-cities?search=${term}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const cities = await response.json();
          setCityResults(cities);
          setShowCityResults(true);
        }
      } catch (error) {
        console.error('Error searching cities:', error);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'cityText') {
      setCitySearchTerm(value);
      searchCities(value);
    }
  };

  const handleCitySelect = (city: City) => {
    setFormData(prev => ({
      ...prev,
      city_id: city.city_id,
      cityText: city.name,
    }));
    setShowCityResults(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      
      const { cityText, ...dataToSend } = formData;
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), 
        credentials: 'include',
      });
      
      if (response.ok) {
        showToasterMessage('Usuario actualizado exitosamente', 'success');
        onClose();
      } else {
        const errorData = await response.json();
        showToasterMessage(errorData.message || 'Error al actualizar el usuario', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToasterMessage('Error al conectar con el servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Editar Usuario</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Identificación</label>
            <input
            autoComplete="off"
              type="text"
              name="identification"
              value={formData.identification}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              name="cityText"
              value={formData.cityText}
              onChange={handleInputChange}
              autoComplete="off"
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {showCityResults && cityResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                {cityResults.map((city) => (
                  <li
                    key={city.city_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </li>
                ))}
              </ul>
            )}
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

export default EditUserForm;