import React from 'react';
import { FaEdit, FaPaperPlane } from 'react-icons/fa';
import Image from 'next/image';
import { PushCampaign } from '@/app/(admin)/actions/notifications';
import Switch from '@/components/Switch';

interface NotificationCardProps {
  campaign: PushCampaign;
  onEdit: () => void;
  onToggleActive: () => void;
  onSend: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  campaign, 
  onEdit, 
  onToggleActive,
  onSend
}) => {
  const formattedDate = campaign.created_at 
    ? new Date(campaign.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Fecha desconocida';

  const formattedLastSent = campaign.last_sent_at
    ? new Date(campaign.last_sent_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Nunca enviada';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold truncate" title={campaign.title}>
            {campaign.title}
          </h2>
          <div className="flex space-x-2">
            <Switch 
              checked={campaign.is_active} 
              onChange={onToggleActive} 
              aria-label={campaign.is_active ? 'Desactivar' : 'Activar'}
            />
          </div>
        </div>
        
        <div className="mb-2 h-16 overflow-hidden text-sm text-gray-600">
          <p className="line-clamp-3" title={campaign.body}>
            {campaign.body}
          </p>
        </div>
        
        {campaign.image_url && (
          <div className="mb-2 h-32 overflow-hidden bg-gray-100 rounded relative">
            {campaign.image_url.startsWith('http') || campaign.image_url.startsWith('/') ? (
              <Image 
                src={campaign.image_url} 
                alt={campaign.title} 
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
                onError={() => {
                  // Si hay error, no hacemos nada, Next.js ya muestra un fallback
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm text-gray-500">Imagen no disponible</span>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <div>
            <span className="font-semibold">Tipo:</span> {campaign.type}
          </div>
          <div>
            <span className="font-semibold">Tag:</span> {campaign.tag}
          </div>
          <div>
            <span className="font-semibold">Creado:</span> {formattedDate}
          </div>
          <div>
            <span className="font-semibold">Enviada:</span> {campaign.sent_count} veces
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Último envío:</span> {formattedLastSent}
          </div>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <button 
            onClick={onEdit}
            className="flex items-center text-sm text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="mr-1" /> Editar
          </button>
          
          <button 
            onClick={onSend}
            disabled={!campaign.is_active}
            className={`flex items-center text-sm ${
              campaign.is_active 
                ? 'text-green-500 hover:text-green-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane className="mr-1" /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;