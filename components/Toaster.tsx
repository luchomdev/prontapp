// components/Toaster.tsx
import React from 'react';

interface ToasterProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, type, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center shadow-lg rounded-lg px-4 py-3 text-white transition-all duration-300 ease-in-out"
         style={{ 
           backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
         }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 font-bold hover:opacity-75"
      >
        ×
      </button>
    </div>
  );
};

export default Toaster;