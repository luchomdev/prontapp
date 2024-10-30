import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useFloating, offset, flip, shift, arrow, Placement } from '@floating-ui/react';

interface PopoverProps {
  anchorEl: HTMLElement | null;
}

const LocationPopover: React.FC<PopoverProps> = ({ anchorEl }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const arrowRef = useRef(null);
  
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

  const { x, y, strategy, placement, middlewareData, refs } = useFloating({
    placement: 'top', // Cambiado a 'top'
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef })
    ],
  });

  const staticSide = placement ? ['top', 'right', 'bottom', 'left'].find(
    side => placement.split('-')[0] === side
  ) : 'top'; // Cambiado a 'top'

  useEffect(() => {
    if (isLocationModalOpen && anchorEl) {
      refs.setReference(anchorEl);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isLocationModalOpen, anchorEl, refs]);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      closeLocationModal();
      router.push('/panel/addresses');
    } else {
      switchToSetAddressModal();
    }
  };

  if (!isVisible) return null;

  const arrowStyle: React.CSSProperties = {
    left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
    top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
    right: '',
    bottom: '',
    ...(staticSide ? { [staticSide]: '-4px' } : {}),
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeLocationModal}
      ></div>
      <div
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          width: 'calc(100% - 20px)',
          maxWidth: '300px',
        }}
        className="bg-white shadow-lg rounded-lg p-4 z-50"
      >
        <div 
          ref={arrowRef}
          className="absolute w-2 h-2 bg-white rotate-45 transform"
          style={{
            ...arrowStyle,
            [staticSide === 'top' ? 'bottom' : 'top']: '-4px', // Ajustado para que la flecha apunte hacia arriba
          }}
        />
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