import React from 'react';

interface AccountUserCardProps {
  user: {
    name: string;
    lastName: string;
    email: string;
    customerInfo: {
      phone: string | null;
      address: string | null;
      identification: string | null;
      cityText: string | null;
    };
  };
}

const AccountUserCard: React.FC<AccountUserCardProps> = ({ user }) => {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
          {getInitials(user.name)}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{`${user.name} ${user.lastName}`}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold">Contraseña:</p>
          <p>*******</p>
        </div>
        <div>
          <p className="font-semibold">Teléfono:</p>
          <p>{user.customerInfo.phone || 'No especificado'}</p>
        </div>
        <div>
          <p className="font-semibold">Dirección:</p>
          <p>{user.customerInfo.address || 'No especificada'}</p>
        </div>
        <div>
          <p className="font-semibold">Identificación:</p>
          <p>{user.customerInfo.identification || 'No especificada'}</p>
        </div>
        <div>
          <p className="font-semibold">Ciudad:</p>
          <p>{user.customerInfo.cityText || 'No especificada'}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountUserCard;