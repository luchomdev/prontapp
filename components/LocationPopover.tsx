import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';

interface PopoverProps {
  anchorEl: HTMLElement | null;
}

const LocationPopover: React.FC<PopoverProps> = ({ anchorEl }) => {
  const [popoverStyle, setPopoverStyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    switchToSetAddressModal,
    shippingAddress,
    isAuthenticated
  } = useStore(state => ({
    isLocationModalOpen: state.isLocationModalOpen,
    closeLocationModal: state.closeLocationModal,
    switchToSetAddressModal: state.switchToSetAddressModal,
    shippingAddress: state.shippingAddress,
    isAuthenticated: state.isAuthenticated
  }));

  useEffect(() => {
    if (isLocationModalOpen && anchorEl && popoverRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let left = anchorRect.left + window.scrollX - popoverRect.width / 2 + anchorRect.width / 2;
      let arrowLeft = '50%';

      // Ajuste para evitar que el popover se salga de la pantalla
      if (left < 10) {
        arrowLeft = `${anchorRect.left + anchorRect.width / 2 - left - 10}px`;
        left = 10;
      } else if (left + popoverRect.width > viewportWidth - 10) {
        left = viewportWidth - popoverRect.width - 10;
        arrowLeft = `${anchorRect.left + anchorRect.width / 2 - left - 10}px`;
      }

      setPopoverStyle({
        position: 'absolute',
        top: `${anchorRect.bottom + window.scrollY + 10}px`, // 10px para el espacio de la flecha
        left: `${left}px`,
      });

      setArrowStyle({
        left: arrowLeft,
      });
    }
  }, [isLocationModalOpen, anchorEl]);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      closeLocationModal();
      router.push('/panel/addresses');
    } else {
      switchToSetAddressModal();
    }
  };

  if (!isLocationModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeLocationModal}
      ></div>
      <div
        ref={popoverRef}
        className="bg-white shadow-lg rounded-lg p-4 w-64 z-50 relative"
        style={popoverStyle as React.CSSProperties}
      >
        <div
          className="absolute w-4 h-4 bg-white transform rotate-45 -top-2"
          style={arrowStyle as React.CSSProperties}
        ></div>
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {shippingAddress ? "Dirección Actual" : "Definir ubicación"}
            </h3>
            <button onClick={closeLocationModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          {shippingAddress ? (
            <p className="text-sm mb-4">
              {`${shippingAddress.cityName}, ${shippingAddress.address}`}
            </p>
          ) : (
            <p className="text-sm mb-4">
              Establece tu dirección de entrega para calcular los costos de envío, otras preferencias.
            </p>
          )}
          <button
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            onClick={handleButtonClick}
          >
            {shippingAddress ? "Cambiar Dirección" : "Tu dirección destino"}
          </button>
        </div>
      </div>
    </>
  );
};

export default LocationPopover;