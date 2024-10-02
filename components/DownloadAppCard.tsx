import React from 'react';
import Image from 'next/image';
import { FaApple, FaAndroid } from 'react-icons/fa';
import { getQRCode } from '@/lib/dataLayer';

const DownloadAppCard: React.FC = async () => {
  const qrCodeBase64 = await getQRCode();

  return (
    <div className="bg-gray-800 p-4 rounded-lg max-w-52">
      <h3 className="text-md font-bold mb-4 text-center">DESCARGA LA APP</h3>
      <div className="w-40 h-40 mx-auto mb-4 relative">
        <Image
          src={`${qrCodeBase64}`}
          alt="Código QR para descargar la app"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <p className="text-sm mb-4 text-center">
        ¡Aprovecha un 5% de descuento en todos los productos al comprar a través de nuestra app!
      </p>
      <div className="flex justify-center space-x-4">
        <FaApple className="text-3xl" />
        <FaAndroid className="text-3xl" />
      </div>
    </div>
  );
};

export default DownloadAppCard;