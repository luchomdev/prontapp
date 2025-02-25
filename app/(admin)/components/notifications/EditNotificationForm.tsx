"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  PushCampaign, 
  getPushCampaignByIdServer, 
  updatePushCampaignServer 
} from '@/app/(admin)/actions/notifications';
import Toaster from '@/components/Toaster';

const NOTIFICATION_TYPES = [
  { value: 'promotion', label: 'Promoción' },
  { value: 'order', label: 'Pedido' },
  { value: 'cart', label: 'Carrito' },
  { value: 'info', label: 'Información' },
];

interface EditNotificationFormProps {
  campaignId: string;
}

const EditNotificationForm: React.FC<EditNotificationFormProps> = ({ campaignId }) => {
  const [campaign, setCampaign] = useState<PushCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getPushCampaignByIdServer(campaignId);
        setCampaign(data);
        setPreviewImage(data.image_url || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        showToasterMessage('Error al cargar la campaña de notificación', 'error');
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const showToasterMessage = (message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewImage(url);
    
    if (campaign) {
      setCampaign({
        ...campaign,
        image_url: url
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (campaign) {
      setCampaign({
        ...campaign,
        [name]: value
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    try {
      formData.append('id', campaignId);
      await updatePushCampaignServer(formData);
      showToasterMessage('Campaña de notificación actualizada exitosamente', 'success');
      setTimeout(() => {
        router.push('/console/notifications');
      }, 2000);
    } catch (error) {
      console.error('Error updating notification campaign:', error);
      showToasterMessage('Error al actualizar la campaña de notificación', 'error');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando datos de la campaña...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>No se encontró la campaña de notificación solicitada.</p>
        <button
          onClick={() => router.push('/console/notifications')}
          className="mt-2 text-blue-500 hover:underline"
        >
          Volver al listado de campañas
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      {showToaster && (
        <div className="mb-4">
          <Toaster
            message={toasterMessage}
            type={toasterType}
            onClose={() => setShowToaster(false)}
          />
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={100}
                value={campaign.title}
                onChange={handleInputChange}
                placeholder="Ej: ¡Oferta Flash! 🔥"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Máximo 100 caracteres. Puede incluir emojis.</p>
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                required
                maxLength={200}
                value={campaign.body}
                onChange={handleInputChange}
                placeholder="Ej: 50% de descuento en todos los productos de belleza. ¡Solo por hoy!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">Máximo 200 caracteres. Sea conciso y directo.</p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL de la imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={campaign.image_url || ''}
                onChange={handleImageUrlChange}
                placeholder="https://www.ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">URL de la imagen que aparecerá en la notificación.</p>
            </div>

            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                Tag <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tag"
                name="tag"
                required
                value={campaign.tag}
                onChange={handleInputChange}
                placeholder="Ej: promo-belleza"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Etiqueta para categorizar la notificación.</p>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                required
                value={campaign.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {NOTIFICATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Tipo de notificación que determinará su comportamiento.</p>
            </div>

            <div>
              <label htmlFor="primaryAction" className="block text-sm font-medium text-gray-700 mb-1">
                Texto del botón <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="primaryAction"
                name="primary_action"
                required
                value={campaign.primary_action}
                onChange={handleInputChange}
                placeholder="Ej: Ver ofertas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Texto para el botón principal de la notificación.</p>
            </div>

            <div>
              <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL de destino <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="targetUrl"
                name="target_url"
                required
                value={campaign.target_url}
                onChange={handleInputChange}
                placeholder="Ej: /products/categoria/belleza"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">URL a donde se dirigirá al usuario al hacer clic en la notificación.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vista previa</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="bg-white rounded-lg shadow p-3 max-w-sm mx-auto">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-semibold text-gray-900">Notificación</p>
                    <p className="text-xs text-gray-500">Ahora</p>
                  </div>
                </div>
                
                <div className="text-base font-medium mb-1">
                  {campaign.title}
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  {campaign.body}
                </div>
                
                {previewImage && (
                  <div className="mb-2 rounded overflow-hidden h-32 relative">
                    {previewImage.startsWith('http') || previewImage.startsWith('/') ? (
                      <Image 
                        src={previewImage} 
                        alt="Vista previa"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                        onError={() => {
                          // Si hay error, no hacemos nada, Next.js ya muestra un fallback
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-sm text-gray-500">URL de imagen inválida</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-2">
                  <button type="button" className="text-xs px-3 py-1 bg-blue-500 text-white rounded">
                    {campaign.primary_action}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-xs text-gray-500 text-center">
                  Esta es una representación aproximada. La apariencia final dependerá del navegador y dispositivo del usuario.
                </p>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1">Estadísticas de la campaña</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>Veces enviada: {campaign.sent_count || 0}</li>
                    <li>Último envío: {campaign.last_sent_at ? new Date(campaign.last_sent_at).toLocaleString('es-ES') : 'Nunca'}</li>
                    <li>Estado: {campaign.is_active ? 'Activa' : 'Inactiva'}</li>
                    <li>Creada: {new Date(campaign.created_at).toLocaleString('es-ES')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/console/notifications')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Guardando...' : 'Actualizar campaña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotificationForm;