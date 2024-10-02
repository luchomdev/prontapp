"use client"
import React, { useState, useEffect } from 'react';
import UserInfoForm from '@/components/panel/UserInfoForm';

interface BasicInformationProps {
  user: any | null;
}

interface UserData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: string;
  userRole: string;
  isActive: boolean;
  customerInfo: {
    identification: string | null;
    phone: string | null;
    address: string | null;
    cityId: number | null;
    cityText: string | null;
  };
}

const BasicInformation: React.FC<BasicInformationProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Renderiza el componente BasicInformation tsx');
    fetchUserData();
  }, [user]);

  const handleUpdateSuccess = () => {
    fetchUserData();
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Información Básica</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Modificar Información'}
        </button>
      </div>
      {isEditing ? (
        <UserInfoForm user={userData} onCancel={() => setIsEditing(false)} onUpdateSuccess={handleUpdateSuccess} />
      ) : (
        <div className="space-y-2">
          <p><strong>Identificación:</strong> {userData.customerInfo.identification || 'No disponible'}</p>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Apellido:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Teléfono:</strong> {userData.customerInfo.phone || 'No disponible'}</p>
          <p><strong>Ciudad:</strong> {userData.customerInfo.cityText || 'No disponible'}</p>
          <p><strong>Dirección:</strong> {userData.customerInfo.address || 'No disponible'}</p>
        </div>
      )}
    </div>
  );
};

export default BasicInformation;