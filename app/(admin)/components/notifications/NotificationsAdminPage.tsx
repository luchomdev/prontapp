"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';
import NotificationCard from '@/app/(admin)/components/notifications/NotificationCard';
import { 
  PushCampaign, 
  fetchPushCampaignsServer, 
  togglePushCampaignActiveServer,
  sendPushCampaignServer 
} from '@/app/(admin)/actions/notifications';

const NotificationsAdminPage = () => {
  const [campaigns, setCampaigns] = useState<PushCampaign[]>([]);
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

  const loadCampaigns = useCallback(async (loadMore = false) => {
    if (isLoadingRef.current) return;
    setIsLoading(true);
    try {
      const currentPage = loadMore ? pageRef.current + 1 : 1;
      const data = await fetchPushCampaignsServer(currentPage);
      
      if (loadMore) {
        setCampaigns(prevCampaigns => [...prevCampaigns, ...data.campaigns]);
        setPage(currentPage);
      } else {
        setCampaigns(data.campaigns);
        setPage(1);
      }
      setHasMore(currentPage < data.totalPages);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToasterMessage('Error al cargar las campañas de notificaciones', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToasterMessage]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCreateCampaign = () => {
    router.push('/console/notifications/campaign');
  };

  const handleEditCampaign = (id: string) => {
    router.push(`/console/notifications/campaign/${id}`);
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedCampaign = await togglePushCampaignActiveServer(id);
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign =>
          campaign.id === id ? { ...campaign, is_active: updatedCampaign.is_active } : campaign
        )
      );
      showToasterMessage(
        `Campaña ${updatedCampaign.is_active ? 'activada' : 'desactivada'} exitosamente`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling campaign status:', error);
      showToasterMessage('Error al cambiar el estado de la campaña', 'error');
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await sendPushCampaignServer(id);
      showToasterMessage(
        `Notificación "${result.campaign}" enviada exitosamente a ${result.sentCount} usuarios`,
        'success'
      );
      loadCampaigns(false); // Recargar para actualizar los contadores
    } catch (error) {
      console.error('Error sending campaign:', error);
      showToasterMessage('Error al enviar la campaña de notificaciones', 'error');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-sm font-bold">Administrar Notificaciones Push</h1>
        <button
          onClick={handleCreateCampaign}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
        >
          <FaPlus className="mr-2" /> Crear nueva campaña
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && campaigns.length === 0 ? (
          <p>Cargando campañas...</p>
        ) : campaigns.length === 0 ? (
          <p>No hay campañas de notificaciones para mostrar</p>
        ) : (
          campaigns.map(campaign => (
            <NotificationCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => handleEditCampaign(campaign.id)}
              onToggleActive={() => handleToggleActive(campaign.id)}
              onSend={() => handleSendCampaign(campaign.id)}
            />
          ))
        )}
      </div>
      {campaigns.length > 0 && (
        <LoadMoreData onLoadMore={() => loadCampaigns(true)} isLoading={isLoading} hasMore={hasMore} />
      )}
    </div>
  );
};

export default NotificationsAdminPage;