import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface City {
  city_id: number;
  name: string;
}

interface EditAccountFormProps {
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    customerInfo: {
      identification: string | null;
      phone: string | null;
      address: string | null;
      cityId: number | null;
      cityText: string | null;
    };
  };
  onClose: () => void;
  onSave: () => void;
}


const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const EditAccountForm: React.FC<EditAccountFormProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    identification: user.customerInfo.identification || '',
    phone: user.customerInfo.phone ? user.customerInfo.phone.slice(2) : '',
    address: user.customerInfo.address || '',
    city_id: user.customerInfo.cityId || '',
    cityText: user.customerInfo.cityText || '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [cityResults, setCityResults] = useState<City[]>([]);
  const [showCityResults, setShowCityResults] = useState(false);

  const searchCities = useCallback((term: string) => {
    if (term.length < 3) return;
    const fetchCities = async () => {
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
    };
    debounce(fetchCities, 300)();
  }, []);

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
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error updating user:', errorData);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Modificarme</h3>
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
              readOnly
              className="mt-1 p-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Identificación</label>
            <input
              type="text"
              name="identification"
              value={formData.identification}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              autoComplete="off"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              name="cityText"
              value={formData.cityText}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              autoComplete="off"
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Dejar en blanco para no cambiar"
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountForm;