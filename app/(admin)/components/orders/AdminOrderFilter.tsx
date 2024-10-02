import React, { useState } from 'react';

interface AdminOrderFilterProps {
  onFilterChange: (startDate: string, endDate: string, orderId: string, status: string, paymentMethod: string) => void;
  onResetFilters: () => void;
}

const AdminOrderFilter: React.FC<AdminOrderFilterProps> = ({ onFilterChange, onResetFilters }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [delivery_state, setDeliveryState] = useState('');
  const [payment, setPayment] = useState('');

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
    onFilterChange(formattedStartDate, formattedEndDate, orderId, delivery_state, payment);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setOrderId('');
    setDeliveryState('');
    setPayment('');
    onResetFilters();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-sm font-bold mb-4">Filtrar órdenes</h2>
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label htmlFor="orderId" className="block text-xs font-medium text-gray-700 mb-1">
            Número de órden
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
            placeholder="Ej. 1234"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
            Fecha inicial
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
            Fecha final
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="delivery_state"
            value={delivery_state}
            onChange={(e) => setDeliveryState(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="1">Creada</option>
            <option value="2">En proceso</option>
            <option value="3">Despachada</option>
            <option value="4">Finalizada</option>
            <option value="5">Cancelada</option>
            <option value="6">En Novedad</option>
          </select>
        </div>
        <div>
          <label htmlFor="paymentMethod" className="block text-xs font-medium text-gray-700 mb-1">
            Método de pago
          </label>
          <select
            id="payment"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="0">Contraentrega</option>
            <option value="1">Pago Online</option>
          </select>
        </div>
        <div className="flex items-end space-x-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Aplicar filtros
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
          >
            Resetear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminOrderFilter;