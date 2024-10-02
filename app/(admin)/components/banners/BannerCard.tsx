import React from 'react';
import { FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';

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
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img 
        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${banner.image_data}`} 
        alt={banner.title} 
        className="w-full h-40 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{banner.title}</h3>
      <p className="text-sm text-gray-600 mb-2">Plataforma: {banner.platform}</p>
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
  );
};

export default BannerCard;