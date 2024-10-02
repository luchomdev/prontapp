"use client"
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/app/(admin)/components/Categories/CategoryCard';
import CategoryForm from '@/app/(admin)/components/Categories/CategoryForm';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import SearchCategories from '@/app/(admin)/components/Categories/SearchCategories';
import Toaster from '@/components/Toaster';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  is_active: boolean;
  image_type: string | null;
  image_data: string | null;
  level: number;
  path: string;
}

const CategoriesAdminPage = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async (loadMore = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/admin?page=${loadMore ? page + 1 : 1}&limit=${limit}&search=${searchTerm}`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        // Sesión expirada
        setToasterMessage('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
        setToasterType('error');
        setShowToaster(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
        return;
      }

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      if (loadMore) {
        setCategories(prevCategories => [...prevCategories, ...data.categories]);
        setPage(prevPage => prevPage + 1);
      } else {
        setCategories(data.categories);
        setPage(1);
      }
      setHasMore(data.categories.length === limit);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setToasterMessage('Error al cargar las categorías. Por favor, intente nuevamente.');
      setToasterType('error');
      setShowToaster(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const handleLoadMore = () => {
    fetchCategories(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
  };

  const renderCategories = (categories: Category[]) => {
    if (searchTerm) {
      // Si hay un término de búsqueda, renderizar las categorías sin estructura jerárquica
      return categories.map(category => (
        <div key={category.id} className="mb-2">
          <CategoryCard category={category} onModify={() => handleModify(category)} />
        </div>
      ));
    } else {
      // Si no hay término de búsqueda, usar la estructura jerárquica
      return renderCategoryTree(categories);
    }
  };

  const renderCategoryTree = (categories: Category[], parentId: string | null = null, level = 0) => {
    return categories
      .filter(category => category.parent_id === parentId)
      .map(category => (
        <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
          <CategoryCard category={category} onModify={() => handleModify(category)} />
          {renderCategoryTree(categories, category.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="p-6">
      {showToaster && (
        <Toaster 
          message={toasterMessage} 
          type={toasterType} 
          onClose={() => setShowToaster(false)} 
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-bold">Administrar Categorías</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center"
        >
          <FaPlus className="mr-2 text-sm"  /> Nueva Categoría
        </button>
      </div>
      <hr className="my-4 border-gray-300" />
      <SearchCategories 
        onSearch={handleSearch} 
        onReset={handleResetSearch}
        searchTerm={searchTerm}
      />
      <div className="space-y-4">
        {renderCategories(categories)}
      </div>
      <LoadMoreData onLoadMore={handleLoadMore} isLoading={isLoading} hasMore={hasMore} />
      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default CategoriesAdminPage;