import React, { useState } from 'react';

interface GuideFilterProps {
  onSearch: (orderId: string) => void;
}

const GuideFilter: React.FC<GuideFilterProps> = ({ onSearch }) => {
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(orderId);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Buscar guía</h2>
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
            Número de Orden
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej. 1066451"
          />
        </div>
        <button 
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Consultar
        </button>
      </form>
    </div>
  );
};

export default GuideFilter;