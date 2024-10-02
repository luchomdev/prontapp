import React from 'react';

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
  order_uuid: string;
}

const AdminCustomerInfo: React.FC<CustomerInfoProps> = ({ customer, order_uuid }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-md font-semibold mb-4">Información del Cliente</h2>
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Identificación:</strong> {customer.identification}</p>
        <p><strong>Dirección de Entrega:</strong> {customer.address}</p>
        <p><strong>Teléfono:</strong> {customer.phone}</p>
        <p><strong>Ciudad:</strong> {customer.ciudadText}</p>
      </div>
    </div>
  );
};

export default AdminCustomerInfo;