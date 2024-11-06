"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import BannerCard from '@/app/(admin)/components/banners/BannerCard';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';
import { Banner, fetchBannersServer, toggleBannerActiveServer } from '@/app/(admin)/actions/banners';

const BannersAdminPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toasterMessage, setToasterMessage] = useState('');
  const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
  const [showToaster, setShowToaster] = useState(false);
  const router = useRouter();
  const pageRef = useRef(page);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const showToasterMessage = useCallback((message: string, type: 'success' | 'error') => {
    setToasterMessage(message);
    setToasterType(type);
    setShowToaster(true);
  }, []);

  const loadBanners = useCallback(async (loadMore = false) => {
    if (isLoadingRef.current) return;
    setIsLoading(true);
    try {
      const currentPage = loadMore ? pageRef.current + 1 : 1;
      const data = await fetchBannersServer(currentPage);
      
      if (loadMore) {
        setBanners(prevBanners => [...prevBanners, ...data.banners]);
        setPage(currentPage);
      } else {
        setBanners(data.banners);
        setPage(1);
      }
      setHasMore(currentPage < data.totalPages);
    } catch (error) {
      console.error('Error fetching banners:', error);
      showToasterMessage('Error al cargar los banners', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToasterMessage]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleCreateBanner = () => {
    router.push('/console/banners/banner');
  };

  const handleEditBanner = (id: string) => {
    router.push(`/console/banners/banner/${id}`);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const updatedBanner = await toggleBannerActiveServer(id);
      setBanners(prevBanners =>
        prevBanners.map(banner =>
          banner.id === id ? { ...banner, is_active: updatedBanner.is_active } : banner
        )
      );
      showToasterMessage(
        `Banner ${updatedBanner.is_active ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
      loadBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      showToasterMessage('Error al cambiar el estado del banner', 'error');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="fixed top-4 right-4 z-50">
        {showToaster && (
          <Toaster
            message={toasterMessage}
            type={toasterType}
            onClose={() => setShowToaster(false)}
          />
        )}
      </div>
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
        {isLoading && banners.length === 0 ? (
          <p>Cargando banners...</p>
        ) : banners.length === 0 ? (
          <p>No hay banners para mostrar</p>
        ) : (
          banners.map(banner => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={() => handleEditBanner(banner.id)}
              onToggleActive={() => handleToggleActive(banner.id, banner.is_active)}
            />
          ))
        )}
      </div>
      {banners.length > 0 && (
        <LoadMoreData onLoadMore={loadBanners} isLoading={isLoading} hasMore={hasMore} />
      )}
    </div>
  );
};

export default BannersAdminPage;