"use client"
import React, { useState } from 'react';
import PageTitle from '@/components/panel/PageTitle';
import GuideFilter from '@/components/panel/GuideFilter';
import ShippingInfo from '@/components/panel/ShippingInfo';
import ShippingInfoSkeleton from '@/components/panel/skeletons/SkeletonShippingInfo';

const GuideTrackingPage: React.FC = () => {
  const [guideData, setGuideData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?order_id=${orderId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch order data');
      const data = await response.json();
      if (data.orders && data.orders.length > 0) {
        setGuideData(data.orders[0]);
      } else {
        setError('No hay datos de guía para el pedido');
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
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
      {!isLoading && guideData && (
        <ShippingInfo
          guide_state_description={guideData.guide_state_description}
          guide_histories={guideData.guide_histories}
        />
      )}
      {!isLoading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default GuideTrackingPage;