"use client"
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Toaster from '@/components/Toaster';
import { updateOrderAddress } from '@/app/actions/orders';

interface CustomerInfoProps {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city_id: string;
    identification: string;
    ciudadText: string;
  };
  guide_id: number | null;
  delivery_state: number;
  order_uuid: string;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer, guide_id, delivery_state, order_uuid }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(customer.address);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const canEditAddress = delivery_state === 1 && guide_id === null;

  const handleUpdateAddress = async () => {
    try {
      const success = await updateOrderAddress(order_uuid, {
        ...customer,
        address: newAddress,
      });

      if (!success) {
        throw new Error('Failed to update address');
      }

      setToastMessage('Dirección actualizada exitosamente');
      setToastType('success');
      customer.address = newAddress;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating address:', error);
      setToastMessage('Error al actualizar la dirección');
      setToastType('error');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Identificación:</strong> {customer.identification}</p>
        <div className="flex items-center justify-between">
          <p><strong>Dirección de Entrega:</strong> 
            {isEditing ? (
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="ml-2 p-1 border rounded"
              />
            ) : (
              customer.address
            )}
          </p>
          {canEditAddress && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-orange-500 hover:text-orange-600"
            >
              <FaEdit size={20} />
            </button>
          )}
        </div>
        {isEditing && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleUpdateAddress}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
            >
              Confirmar cambio
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewAddress(customer.address);
              }}
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        )}
        <p><strong>Teléfono:</strong> {customer.phone}</p>
        <p><strong>Ciudad:</strong> {customer.ciudadText}</p>
      </div>
      {toastMessage && (
        <Toaster
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default CustomerInfo;