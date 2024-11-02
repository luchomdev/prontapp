import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { searchCities } from '@/app/actions/locations';

interface City {
  city_id: number;
  name: string;
}

interface AddressFormProps {
  onSave: (address: { city_id: number; cityName: string; address: string; addressComplement: string; phone: string }) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSave, onCancel }) => {
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [address, setAddress] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (citySearch.length > 2 && isSearching) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const cities = await searchCities(citySearch);
          setCitySuggestions(cities);
        } catch (error) {
          console.error('Error searching cities:', error);
          setCitySuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setCitySuggestions([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [citySearch, isSearching]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCitySearch(city.name);
    setCitySuggestions([]);
    setIsSearching(false);
  };

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCitySearch(value);
    setSelectedCity(null);
    setIsSearching(true);
  };

  const handleSaveAddress = () => {
    if (selectedCity) {
      onSave({
        city_id: selectedCity.city_id,
        cityName: selectedCity.name,
        address: `${address} ${addressComplement ? '~' + addressComplement : '~'}`,
        addressComplement,
        phone,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Agregar nueva dirección</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          value={citySearch}
          onChange={handleCitySearchChange}
          onFocus={() => setIsSearching(true)}
          placeholder="Buscar ciudad"
          className="w-full p-2 border rounded"
        />
        {isLoading && <div className="absolute right-2 top-2">Cargando...</div>}
        {citySuggestions.length > 0 && isSearching && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
            {citySuggestions.map((city) => (
              <li
                key={city.city_id}
                onClick={() => handleCitySelect(city)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Dirección"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        value={addressComplement}
        onChange={(e) => setAddressComplement(e.target.value)}
        placeholder="Complemento de dirección (opcional)"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(+57) Móvil"
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          onClick={handleSaveAddress}
          disabled={!selectedCity || !address || !phone}
        >
          Guardar dirección
        </button>
      </div>
    </div>
  );
};

export default AddressForm;