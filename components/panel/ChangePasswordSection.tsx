"use client"
import React, { useState } from 'react';
import ChangePasswordModal from '@/components/panel/ChangePasswordModal';

interface ChangePasswordSectionProps {
  userId: string;
}

const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [pin] = useState(Math.floor(1000 + Math.random() * 9000));

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Seguridad de la Cuenta</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Cambiar contraseña
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <p><strong>Pin:</strong> {pin}</p>
        <p><strong>ID:</strong> {userId}</p>
        <p><strong>Contraseña:</strong> ***********</p>
      </div>
      {showModal && (
        <ChangePasswordModal
          onClose={() => setShowModal(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default ChangePasswordSection;