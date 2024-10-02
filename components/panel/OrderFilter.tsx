import React, { useState } from 'react';

interface OrderFilterProps {
  onFilterChange: (startDate: string, endDate: string, orderId: string) => void;
  onResetFilters: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilterChange, onResetFilters }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderId, setOrderId] = useState('');

  const formatDateToUTC = (date: string, isEndDate: boolean = false): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isEndDate) {
      d.setHours(23, 59, 59, 999);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    return d.toISOString();
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedStartDate = formatDateToUTC(startDate);
    const formattedEndDate = formatDateToUTC(endDate, true);
    onFilterChange(formattedStartDate, formattedEndDate, orderId);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setOrderId('');
    onResetFilters();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filtrar órdenes</h2>
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Orden
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej. 1234"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha inicial
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha final
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-end space-x-2">
          <button 
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Aplicar filtros
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Resetear
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFilter;