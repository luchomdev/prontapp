"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import BannerCard from '@/app/(admin)/components/banners/BannerCard';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';

interface Banner {
  id: string;
  title: string;
  link: string;
  order_index: number;
  is_active: boolean;
  platform: 'web' | 'mobile';
  image_data: string;
}

const BannersAdminPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const router = useRouter();

  const fetchBanners = useCallback(async (loadMore = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/admin?page=${loadMore ? page + 1 : 1}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (loadMore) {
        setBanners(prevBanners => [...prevBanners, ...data.banners]);
        setPage(prevPage => prevPage + 1);
      } else {
        setBanners(data.banners);
      }
      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      console.error('Error fetching banners:', error);
      showToasterMessage('Error al cargar los banners', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners, updateTrigger]);

  const handleCreateBanner = () => {
    router.push('/console/banners/banner');
  };

  const handleEditBanner = (id: string) => {
    router.push(`/console/banners/banner/${id}`);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedBanner = await response.json();
        setBanners(prevBanners =>
          prevBanners.map(banner =>
            banner.id === id ? { ...banner, is_active: updatedBanner.is_active } : banner
          )
        );
        showToasterMessage(`Banner ${updatedBanner.is_active ? 'activado' : 'desactivado'} exitosamente`, 'success');
        setUpdateTrigger(prev => prev + 1); // Forzar re-renderizado
      } else {
        const errorData = await response.json();
        showToasterMessage(errorData.message || 'Error al cambiar el estado del banner', 'error');
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      showToasterMessage('Error al conectar con el servidor', 'error');
    }
  };

  const showToasterMessage = (message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
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
        <h1 className="text-sm font-bold">Administrar banners encabezados</h1>
        <button
          onClick={handleCreateBanner}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
        >
          <FaPlus className="mr-2" /> Crear nuevo banner
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(banner => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={() => handleEditBanner(banner.id)}
            onToggleActive={() => handleToggleActive(banner.id, banner.is_active)}
          />
        ))}
      </div>
      <LoadMoreData onLoadMore={() => fetchBanners(true)} isLoading={isLoading} hasMore={hasMore} />
    </div>
  );
};

export default BannersAdminPage;