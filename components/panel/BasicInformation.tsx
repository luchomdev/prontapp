"use client"
import React, { useState, useEffect, useCallback } from 'react';
import UserInfoForm from '@/components/panel/UserInfoForm';
import { fetchUserDetails } from '@/app/actions/users';

interface CustomerInfo {
  identification: string | null;
  phone: string | null;
  address: string | null;
  cityId: number | null;
  cityText: string | null;
}

interface UserData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt: string;
  userRole: string;
  isActive: boolean;
  customerInfo: CustomerInfo;
}

interface BasicInformationProps {
  user: any | null;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchUserDetails(user.id);
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('Renderiza el componente BasicInformation tsx');
    fetchUserData();
  }, [fetchUserData]);

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
        <UserInfoForm 
          user={userData} 
          onCancel={() => setIsEditing(false)} 
          onUpdateSuccess={handleUpdateSuccess} 
        />
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