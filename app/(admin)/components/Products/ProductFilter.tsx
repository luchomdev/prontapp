"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { FaSearch, FaUndo } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { fetchCategoriesServer } from '@/app/(admin)/actions/products';

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    level?: number;
}

interface FilterParams {
    stockId: string | null;
    search: string;
    category_id: string | null;
}

interface ProductFilterProps {
    onFilterChange: (filterParams: FilterParams) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
    const router = useRouter()
    const [stockId, setStockId] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    const handleSessionExpired = useCallback(() => {
        setTimeout(() => {
            router.push('/auth/signin');
        }, 3000);
    }, [router]);

    const loadCategories = useCallback(async () => {
        try {
            const categories = await fetchCategoriesServer();
            setAllCategories(categories);
        } catch (error: any) {
            if (error.message === '401') {
                handleSessionExpired();
                return;
            }
            console.error('Error fetching all categories:', error);
        }
    }, [handleSessionExpired]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleApplyFilter = useCallback(() => {
        const filterParams: FilterParams = {
            stockId: stockId || null,
            search: search,
            category_id: categoryId || null,
        };
        onFilterChange(filterParams);
    }, [stockId, search, categoryId, onFilterChange]);

    const handleResetFilter = useCallback(() => {
        setStockId('');
        setSearch('');
        setCategoryId('');
        onFilterChange({
            stockId: null,
            search: '',
            category_id: null,
        });
    }, [onFilterChange]);

    const renderCategoryOptions = useCallback((categories: Category[], parentId: string | null = null, level = 0): JSX.Element[] => {
        return categories
            .filter(cat => cat.parent_id === parentId)
            .flatMap(cat => [
                <option key={cat.id} value={cat.id} style={{ paddingLeft: `${level * 20}px` }}>
                    {'\u00A0'.repeat(level * 2)}{cat.name}
                </option>,
                ...renderCategoryOptions(categories, cat.id, level + 1)
            ]);
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="StockId"
                    value={stockId}
                    onChange={(e) => setStockId(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Buscar productos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Todas las categorías</option>
                    {renderCategoryOptions(allCategories)}
                </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={handleResetFilter}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-1 rounded inline-flex items-center text-sm"
                >
                    <FaUndo className="mr-2" />
                    Resetear
                </button>
                <button
                    onClick={handleApplyFilter}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded inline-flex items-center text-sm"
                >
                    <FaSearch className="mr-2" />
                    Aplicar filtros
                </button>
            </div>
        </div>
    );
};

export default ProductFilter;