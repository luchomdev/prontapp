import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToasterProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toaster: React.FC<ToasterProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';
  const Icon = type === 'success' ? FaCheckCircle : FaTimesCircle;

  return (
    <div
      className={`${bgColor} ${textColor} px-4 py-3 rounded-md shadow-lg max-w-md border-l-4 ${borderColor} animate-fadeIn`}
      role="alert"
    >
      <div className="flex items-center">
        <Icon className="mr-3 text-2xl" />
        <div className="mr-8">{message}</div>
        <button
          onClick={onClose}
          className="ml-auto text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toaster;