import React, { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ProductWarrantyProps {
  warranty: string;
}

const ProductWarranty: React.FC<ProductWarrantyProps> = ({ warranty }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-yellow-50 p-3 rounded-md mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaInfoCircle className="text-yellow-500 mr-2" />
          <h3 className="text-sm font-semibold text-slate-500">Información de garantía</h3>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen && (
        <p className="text-sm text-gray-600 mt-2">
          {warranty}
        </p>
      )}
    </div>
  );
};

export default ProductWarranty;