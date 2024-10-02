import React from 'react';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { Address } from '@/stores/cartStore';

interface AddressCardProps {
  address: Address;
  onDelete: () => void;
  onSelect: () => void;
  isDefault: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onDelete, onSelect, isDefault }) => {
  return (
    <div 
      className={`relative p-4 border rounded-lg mb-4 cursor-pointer transition-colors duration-200 ${
        isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <FaTrash />
      </button>
      {isDefault && (
        <div className="absolute top-2 left-2 text-orange-500">
          <FaCheckCircle />
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2">{address.cityName}</h3>
      <p className="text-gray-700 mb-1">{address.address}</p>
      <p className="text-gray-600 text-sm mb-2">{address.addressComplement}</p>
      <p className="text-gray-600 text-sm">{address.phone}</p>
    </div>
  );
};

export default AddressCard;