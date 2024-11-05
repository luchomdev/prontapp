"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import Toaster from '@/components/Toaster';
import { 
  Category, 
  fetchAllCategories as fetchAllCategoriesServer, 
  fetchCategoryDetails as fetchCategoryDetailsServer,
  saveCategory as saveCategoryServer
} from '@/app/(admin)/actions/categories';



interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose }) => {
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    parent_id: null,
    slug: '',
    is_active: true,
    image_type: null,
    image_data: null,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const fetchAllCategories = useCallback(async () => {
    try {
      const categories = await fetchAllCategoriesServer();
      setAllCategories(categories);
    } catch (error) {
      console.error('Error fetching all categories:', error);
      showToasterMessage('Error al cargar las categorías', 'error');
    }
  }, []);

  const fetchCategoryDetails = useCallback(async (categoryId: string) => {
    try {
      const categoryData = await fetchCategoryDetailsServer(categoryId);
      setFormData(categoryData);
    } catch (error) {
      console.error('Error fetching category details:', error);
      showToasterMessage('Error al cargar los detalles de la categoría', 'error');
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
    if (category) {
      fetchCategoryDetails(category.id);
    }
  }, [category, fetchAllCategories, fetchCategoryDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('is_active', formData.is_active.toString());
    if (formData.parent_id) {
      formDataToSend.append('parent_id', formData.parent_id);
    }
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const result = await saveCategoryServer(formDataToSend, category?.id);
      showToasterMessage(result.message, result.success ? 'success' : 'error');
      
      if (result.success) {
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showToasterMessage('Error al conectar con el servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToasterMessage = (message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
  };

  const renderCategoryOptions = (categories: Category[], parentId: string | null = null, level = 0): JSX.Element[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .flatMap(cat => [
        <option key={cat.id} value={cat.id} style={{paddingLeft: `${level * 20}px`}}>
          {'\u00A0'.repeat(level * 2)}{cat.name}
        </option>,
        ...renderCategoryOptions(categories, cat.id, level + 1)
      ]);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {showToaster && (
          <Toaster 
            message={toasterMessage} 
            type={toasterType} 
            onClose={() => setShowToaster(false)} 
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{category ? 'Modificar' : 'Crear'} Categoría</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Categoría Padre</label>
            <select
              name="parent_id"
              value={formData.parent_id || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Sin padre</option>
              {renderCategoryOptions(allCategories)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Activo</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;