import React, { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatCurrency } from '@/lib/Helpers';

interface ShippingEstimateProps {
  cityName: string;
  shippingCost: number;
}

const ShippingEstimate: React.FC<ShippingEstimateProps> = ({ cityName, shippingCost }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-yellow-50 p-3 rounded-md mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaInfoCircle className="text-yellow-500 mr-2" />
          <h3 className="text-sm font-semibold text-slate-500">Estimación costo de envío</h3>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen && (
        <p className="text-sm text-gray-600 mt-2">
          El costo aproximado del envío a {cityName.toLowerCase()} de este producto es de {formatCurrency(shippingCost)}
        </p>
      )}
    </div>
  );
};

export default ShippingEstimate;