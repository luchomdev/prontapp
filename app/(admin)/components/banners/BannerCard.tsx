import React, { useState } from 'react';
import Image from 'next/image';
import { FaEdit, FaToggleOn, FaToggleOff, FaCopy, FaCheck } from 'react-icons/fa';
import Toaster from '@/components/Toaster';

interface BannerCardProps {
  banner: {
    id: string;
    title: string;
    image_data: string;
    is_active: boolean;
    platform: 'web' | 'mobile';
  };
  onEdit: () => void;
  onToggleActive: () => void;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, onEdit, onToggleActive }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(banner.image_data)
      .then(() => {
        setIsCopied(true);
        setShowToast(true);
        
        // Restaurar el icono después de 2 segundos
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);

        // Ocultar el toast después de 2 segundos
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        setShowToast(true);
      });
  };

  return (
    <>
      {/* El Toaster se mueve al inicio del componente */}
      {showToast && (
        <div className="relative">
          <Toaster
            message={isCopied ? "¡Ruta copiada al portapapeles!" : "Error al copiar la ruta"}
            type={isCopied ? "success" : "error"}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="relative w-full aspect-[16/9] mb-4">
          <Image 
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${banner.image_data}`} 
            alt={banner.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{banner.title}</h3>
        <p className="text-sm text-gray-600 mb-2">Plataforma: {banner.platform}</p>
        
        <div className="flex items-center space-x-2 mb-2 bg-gray-50 p-2 rounded text-sm">
          <span className="text-gray-600 truncate flex-1">{banner.image_data}</span>
          <button 
            onClick={handleCopyPath}
            className={`p-1 transition-colors duration-200 ${
              isCopied ? 'text-green-500 hover:text-green-700' : 'text-blue-500 hover:text-blue-700'
            }`}
            title={isCopied ? 'Copiado!' : 'Copiar ruta de imagen'}
          >
            {isCopied ? <FaCheck size={16} /> : <FaCopy size={16} />}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${banner.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {banner.is_active ? 'Activo' : 'Inactivo'}
          </span>
          <div className="flex space-x-2">
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
              <FaEdit size={20} />
            </button>
            <button onClick={onToggleActive} className={banner.is_active ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}>
              {banner.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerCard;