"use client"
import React, { useState, useEffect, useRef } from 'react';
import Toaster from '@/components/Toaster';
import { searchCities } from '@/app/actions/locations';
import { updateUserProfile } from '@/app/actions/users';

interface City {
    city_id: number;
    name: string;
}
interface UserInfoFormProps {
    user: any;
    onCancel: () => void;
    onUpdateSuccess: () => void;
}

interface FormData {
    identification: string;
    address: string;
    name: string;
    lastName: string;
    email: string;
    city_id: string;
    phone: string;
    cityText?: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ user, onCancel, onUpdateSuccess }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [formData, setFormData] = useState<FormData>({
        identification: user.customerInfo?.identification || '',
        address: user.customerInfo?.address || '',
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        city_id: user.customerInfo?.cityId?.toString() || '',
        phone: user.customerInfo?.phone ? user.customerInfo.phone.slice(2) : '',
        cityText: user.customerInfo?.cityText || '',
    });
    const [cities, setCities] = useState<City[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);


    const handleCitySearch = async (search: string) => {
        if (search.length < 3) return;
        try {
            const citiesData = await searchCities(search);
            setCities(citiesData);
        } catch (error) {
            console.error('Error searching cities:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: phoneValue });
        } else if (name === 'cityText') {
            setFormData({ ...formData, [name]: value });
            setIsSearching(true);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                handleCitySearch(value);
            }, 300);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const result = await updateUserProfile({
                identification: formData.identification,
                address: formData.address,
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
                city_id: formData.city_id,
                phone: formData.phone,
            });

            setToastMessage(result.message);
            setToastType(result.success ? 'success' : 'error');

            if (result.success) {
                setTimeout(() => {
                    onUpdateSuccess();
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            setToastMessage('Error al actualizar la información del usuario');
            setToastType('error');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="identification" className="block mb-1">Identificación</label>
                <input
                    type="text"
                    id="identification"
                    name="identification"
                    value={formData.identification}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label htmlFor="name" className="block mb-1">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label htmlFor="lastName" className="block mb-1">Apellido</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                    readOnly
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    className="w-full p-2 border rounded bg-gray-100"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block mb-1">Teléfono</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Ingrese los 10 dígitos del número"
                />
            </div>
            <div>
                <label htmlFor="cityText" className="block mb-1">Ciudad</label>
                <input
                    type="text"
                    id="cityText"
                    name="cityText"
                    value={formData.cityText}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {cities.length > 0 && (
                    <ul className="mt-2 border rounded max-h-40 overflow-y-auto">
                        {cities.map((city: { name: string; city_id: number }) => (
                            <li
                                key={city.city_id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setFormData({ ...formData, cityText: city.name, city_id: city.city_id.toString() });
                                    setCities([]);
                                }}
                            >
                                {city.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <label htmlFor="address" className="block mb-1">Dirección</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isUpdating ? 'Actualizando tus Datos' : 'Guardar Cambios'}
                </button>
            </div>
            {toastMessage && (
                <Toaster
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </form>
    );
};

export default UserInfoForm;