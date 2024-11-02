"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, Address } from '@/stores/cartStore';
import PageTitle from './PageTitle';
import AddressList from './AddressList';
import AddressForm from './AddressForm';
import AddressManagementSkeleton from '@/components/panel/skeletons/SkeletonAddressManagement';
import { fetchAddresses, addNewAddress, setDefaultAddress, removeAddress } from '@/app/actions/addresses';

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
  } = useStore((state) => ({
    addresses: state.addresses,
    setAddresses: state.setAddresses,
    addAddress: state.addAddress,
    deleteAddress: state.deleteAddress,
    setShippingAddress: state.setShippingAddress
  }));
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      try {
        const addressesData = await fetchAddresses();
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
    loadAddresses();
  }, [setAddresses]);

  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleSaveAddress = async (newAddress: Omit<Address, 'id'>) => {
    try {
      const resNewAddress = await addNewAddress(newAddress);
      if(resNewAddress) {
        await addAddress(resNewAddress);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const success = await removeAddress(id);
      if (success) {
        await deleteAddress(id);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSelectAddress = async (address: Address) => {
    try {
      const success = await setDefaultAddress(address.id);
      if (success) {
        setShippingAddress({
          city_id: address.city_id,
          cityName: address.cityName,
          address: address.address,
          addressComplement: address.addressComplement,
        });
        setDefaultAddressId(address.id);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
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