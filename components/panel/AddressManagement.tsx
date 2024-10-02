"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, Address } from '@/stores/cartStore';
import PageTitle from './PageTitle';
import AddressList from './AddressList';
import AddressForm from './AddressForm';
import AddressManagementSkeleton from '@/components/panel/skeletons/SkeletonAddressManagement';



const AddressManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { 
    addresses, 
    setAddresses, 
    addAddress, 
    deleteAddress, 
    setShippingAddress 
  } = useStore((state)=>({
    addresses:state.addresses,
    setAddresses: state.setAddresses,
    addAddress: state.addAddress,
    deleteAddress: state.deleteAddress,
    setShippingAddress: state.setShippingAddress
  }));
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addresses`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch addresses');
        const addressesData = await response.json();
        setAddresses(addressesData);
        const defaultAddress = addressesData.find((addr: Address) => addr.default_address);
        if (defaultAddress) {
          setDefaultAddressId(defaultAddress.id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [setAddresses]);

  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleSaveAddress = async (newAddress: Omit<Address, 'id'>) => {
    try {
      await addAddress(newAddress);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Error deleting address:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleSelectAddress = async (address: Address) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/address/${address.id}/set-default`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to set default address');
      
      setShippingAddress({
        city_id: address.city_id,
        cityName: address.cityName,
        address: address.address,
        addressComplement: address.addressComplement,
      });
      setDefaultAddressId(address.id);
    } catch (error) {
      console.error('Error setting default address:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (isLoading) {
    return <AddressManagementSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Mis Direcciones" />
      <button
        onClick={handleAddAddress}
        className="mb-6 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
      >
        Agregar Nueva Dirección
      </button>
      {showForm && (
        <AddressForm
          onSave={handleSaveAddress}
          onCancel={() => setShowForm(false)}
        />
      )}
      <AddressList
        addresses={addresses}
        onDeleteAddress={handleDeleteAddress}
        onSelectAddress={handleSelectAddress}
        defaultAddressId={defaultAddressId}
      />
    </div>
  );
};

export default AddressManagement;