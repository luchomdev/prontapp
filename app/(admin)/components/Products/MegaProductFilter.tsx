import React, { useState, useCallback } from 'react';
import { FaSearch, FaUndo } from 'react-icons/fa';

interface FilterParams {
    search: string;
    stockID: string;
    groupByStockID: string;
    sortBy: string;
}

interface MegaProductFilterProps {
    onFilterChange: (filterParams: FilterParams) => void;
}

const MegaProductFilter: React.FC<MegaProductFilterProps> = ({ onFilterChange }) => {
    const [search, setSearch] = useState<string>('');
    const [stockID, setStockId] = useState<string>('');
    const [groupByStockID, setGroupByStockID] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('1');

    const handleApplyFilter = useCallback(() => {
        const filterParams: FilterParams = {
            search,
            stockID,
            groupByStockID,
            sortBy,
        };
        onFilterChange(filterParams);
    }, [search, stockID, groupByStockID, sortBy, onFilterChange]);

    const handleResetFilter = useCallback(() => {
        setSearch('');
        setStockId('');
        setGroupByStockID('');
        setSortBy('1');
        onFilterChange({
            search: '',
            stockID: '',
            groupByStockID: '',
            sortBy: '1',
        });
    }, [onFilterChange]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Buscar productos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Stock ID"
                    value={stockID}
                    onChange={(e) => setStockId(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Agrupar por Stock ID"
                    value={groupByStockID}
                    onChange={(e) => setGroupByStockID(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="1">Más reciente</option>
                    <option value="2">Más antiguo</option>
                    <option value="3">Precio (de mayor a menor)</option>
                    <option value="4">Precio (de menor a mayor)</option>
                    <option value="5">Más Vendido</option>
                    <option value="6">Mayor Stock</option>
                    <option value="7">Menor Stock</option>
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
                    Filtrar
                </button>
            </div>
        </div>
    );
};

export default MegaProductFilter;