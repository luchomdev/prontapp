// components/ModalSetAddress.tsx
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';

interface City {
    city_id: number;
    name: string;
}



const ModalSetAddress: React.FC = () => {
    const [citySearch, setCitySearch] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [address, setAddress] = useState('');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const {
        isSetAddressModalOpen,
        closeSetAddressModal,
        setShippingAddress
    } = useStore(state => ({
        isSetAddressModalOpen: state.isSetAddressModalOpen,
        closeSetAddressModal: state.closeSetAddressModal,
        setShippingAddress: state.setShippingAddress
    }));

    console.log('ModalSetAddress rendering, isOpen:', isSetAddressModalOpen);

    useEffect(() => {
        if (citySearch.length > 2 && isSearching) {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                searchCities(citySearch);
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

    const searchCities = async (search: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/v1/locations/search-cities?search=${encodeURIComponent(search)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            const data: City[] = await response.json();
            setCitySuggestions(data);
        } catch (error) {
            console.error('Error searching cities:', error);
            setCitySuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

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
            setShippingAddress({
                city_id: selectedCity.city_id,
                cityName: selectedCity.name,
                address,
                addressComplement: details
            });
            closeSetAddressModal();
        }
    };
    console.log('ModalSetAddress rendering, isOpen:', isSetAddressModalOpen);
    if (!isSetAddressModalOpen) {
        console.log('ModalSetAddress not rendering because isSetAddressModalOpen is false');
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Establecer dirección</h2>
                    <button onClick={closeSetAddressModal} className="text-gray-500 hover:text-gray-700">
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
                    placeholder="Carrera 22 90 34"
                    className="w-full p-2 mb-4 border rounded"
                />
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Detalles adicionales de la dirección"
                    className="w-full p-2 mb-4 border rounded h-24"
                ></textarea>
                <button
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                    onClick={handleSaveAddress}
                >
                    Guardar dirección
                </button>
            </div>
        </div>
    );
};

export default ModalSetAddress;