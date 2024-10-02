import React from 'react';
import AddressCard from './AddressCard';
import { Address } from '@/stores/cartStore';

interface AddressListProps {
  addresses: Address[];
  onDeleteAddress: (id: string) => void;
  onSelectAddress: (address: Address) => void;
  defaultAddressId: string | null;
}

const AddressList: React.FC<AddressListProps> = ({ 
  addresses, 
  onDeleteAddress, 
  onSelectAddress,
  defaultAddressId 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onDelete={() => onDeleteAddress(address.id)}
          onSelect={() => onSelectAddress(address)}
          isDefault={address.id === defaultAddressId}
        />
      ))}
    </div>
  );
};

export default AddressList;