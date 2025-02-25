"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPushCampaignServer } from '@/app/(admin)/actions/notifications';
import Toaster from '@/components/Toaster';

const NOTIFICATION_TYPES = [
  { value: 'promotion', label: 'Promoción' },
  { value: 'order', label: 'Pedido' },
  { value: 'cart', label: 'Carrito' },
  { value: 'info', label: 'Información' },
];

const CreateNotificationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    tag: '',
    type: 'promotion',
    primaryAction: '',
    targetUrl: ''
  });
  const router = useRouter();

  const showToasterMessage = (message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'imageUrl') {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      
      await createPushCampaignServer(formDataObj);
      showToasterMessage('Campaña de notificación creada exitosamente', 'success');
      setTimeout(() => {
        router.push('/console/notifications');
      }, 2000);
    } catch (error) {
      console.error('Error creating notification campaign:', error);
      showToasterMessage('Error al crear la campaña de notificación', 'error');
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
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
                value={formData.body}
                onChange={handleInputChange}
                rows={4}
                required
                maxLength={200}
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
                value={formData.imageUrl}
                onChange={handleInputChange}
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
                value={formData.tag}
                onChange={handleInputChange}
                required
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
                value={formData.type}
                onChange={handleInputChange}
                required
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
                name="primaryAction"
                value={formData.primaryAction}
                onChange={handleInputChange}
                required
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
                name="targetUrl"
                value={formData.targetUrl}
                onChange={handleInputChange}
                required
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
                  {formData.title || 'Vista previa del título'}
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  {formData.body || 'Vista previa de la descripción de la notificación'}
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
                    {formData.primaryAction || 'Vista previa del botón'}
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-xs text-gray-500 text-center">
                Esta es una representación aproximada. La apariencia final dependerá del navegador y dispositivo del usuario.
              </p>
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
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Guardando...' : 'Guardar campaña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotificationForm;