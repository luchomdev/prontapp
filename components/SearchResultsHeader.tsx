'use client'

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface SearchResultsHeaderProps {
    searchTerm: string;
    totalResults: number;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
    searchTerm,
    totalResults,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

    const handleResetSearch = () => {
        router.push('/products');
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.set('minPrice', minPrice);
        params.set('maxPrice', maxPrice);
        params.set('sortBy', sortBy);
        router.push(`/products?${params.toString()}`);
        setIsFilterModalOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center my-4 mx-4">
            <div className="flex items-center space-x-4">
                <div className="text-xl font-semibold">
                    Resultado de la búsqueda : {searchTerm} {searchTerm && <button
                    onClick={handleResetSearch}
                    className="ml-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                    <FaTimes />
                </button>}
                </div>
                

                <p className="text-gray-600">Arrojó {totalResults} registros</p>
            </div>

            <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                <FaFilter className="mr-2" /> Filtrar
            </button>

            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Filtros</h3>
                        <div className="mb-4">
                            <label className="block mb-2">Rango de precio:</label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Menor precio"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="border p-2 w-1/2"
                                />
                                <input
                                    type="number"
                                    placeholder="Mayor precio"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="border p-2 w-1/2"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Ordenar por:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border p-2 w-full"
                            >
                                <option value="">Seleccionar</option>
                                <option value="name">Nombre</option>
                                <option value="price">Precio</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResultsHeader;