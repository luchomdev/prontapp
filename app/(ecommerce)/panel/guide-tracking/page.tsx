"use client"
import React, { useState } from 'react';
import PageTitle from '@/components/panel/PageTitle';
import GuideFilter from '@/components/panel/GuideFilter';
import ShippingInfo from '@/components/panel/ShippingInfo';
import ShippingInfoSkeleton from '@/components/panel/skeletons/SkeletonShippingInfo';
import NoData from '@/components/NoData';
import { fetchOrderGuide } from '@/app/actions/orders';

interface GuideHistory {
  created_at: string;
  description: string;
}

interface GuideData {
  guide_state_description: string;
  guide_histories: GuideHistory[];
}

const GuideTrackingPage: React.FC = () => {
  const [guideData, setGuideData] = useState<GuideData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setGuideData(null);
    
    try {
      const orderData = await fetchOrderGuide(orderId);
      
      if (orderData) {
        setGuideData(orderData);
        setError(null);
      } else {
        setGuideData(null);
        setError('No hay datos de guía para el pedido');
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
      setGuideData(null);
      setError('Error al buscar la guía');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Seguimiento de guías" />
      <GuideFilter onSearch={handleSearch} />
      {isLoading && <ShippingInfoSkeleton />}
      {!isLoading && !hasSearched && (
        <NoData message="Empieza con la consulta de una guía" />
      )}
      {!isLoading && hasSearched && !error && guideData && (
        <ShippingInfo
          guide_state_description={guideData.guide_state_description}
          guide_histories={guideData.guide_histories}
        />
      )}
      {!isLoading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default GuideTrackingPage;