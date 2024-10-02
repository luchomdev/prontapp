import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditBannerFormProps {
  bannerId: string;
}

const EditBannerForm: React.FC<EditBannerFormProps> = ({ bannerId }) => {
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        orderIndex: 0,
        isActive: true,
        platform: 'web',
        image: null as File | null,
      });
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      useEffect(() => {
        fetchBannerData();
      }, [bannerId]);

  const fetchBannerData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/admin/${bannerId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          title: data.title,
          link: data.link,
          orderIndex: data.order_index,
          isActive: data.is_active,
          platform: data.platform,
        }));
      } else {
        console.error('Error fetching banner data');
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('link', formData.link);
    formDataToSend.append('platform', formData.platform);
    formDataToSend.append('orderIndex', formData.orderIndex.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${bannerId}`, {
        method: 'PUT',
        body: formDataToSend,
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/console/banners');
      } else {
        console.error('Error updating banner:', await response.text());
      }
    } catch (error) {
      console.error('Error updating banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>{JSON.stringify(formData)}</div> */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">Enlace</label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          required
          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700">Orden</label>
        <input
          type="number"
          id="orderIndex"
          name="orderIndex"
          value={formData.orderIndex}
          onChange={handleInputChange}
          required
          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Plataforma</label>
        <select
          id="platform"
          name="platform"
          value={formData.platform}
          onChange={handleInputChange}
          required
          className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
        </select>
      </div>
      <div>
        <label htmlFor="isActive" className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Activo</span>
        </label>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          className="mt-1 p-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Banner'}
        </button>
      </div>
    </form>
  );
};

export default EditBannerForm;