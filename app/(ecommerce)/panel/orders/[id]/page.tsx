"use client"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTitle from '@/components/panel/PageTitle';
import OrderInfo from '@/components/panel/OrderInfo';
import CustomerInfo from '@/components/panel/CustomerInfo';
import OrderProducts from '@/components/panel/OrderProducts';
import ShippingInfo from '@/components/panel/ShippingInfo';
import Link from 'next/link';
import { fetchOrderDetail } from '@/app/actions/orders';

import OrderInfoSkeleton from '@/components/panel/skeletons/OrderInfoSkeleton';
import CustomerInfoSkeleton from '@/components/panel/skeletons/CustomerInfoSkeleton';
import OrderProductsSkeleton from '@/components/panel/skeletons/OrderProductsSkeleton';
import ShippingInfoSkeleton from '@/components/panel/skeletons/ShippingInfoSkeleton';

interface OrderDetail {
    order_id: number;
    delivery_state_description: string;
    delivery_state: number;
    created_at: string;
    payment: number;
    customer: any;
    stocks: any;
    total_shipping_cost: string | null;
    id: string;
    guide_state_description: string | null;
    guide_histories: Array<{ created_at: string; description: string }> | null;
    guide_id: number | null;
    last_state: number | null;
}

const OrderDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [orderData, setOrderData] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrderDetail = async () => {
            setIsLoading(true);
            try {
                const data = await fetchOrderDetail(params.id as string);
                if (data) {
                    setOrderData(data);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            loadOrderDetail();
        }
    }, [params.id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/panel/orders" className="w-auto max-w-20 flex items-center bg-blue-400 text-white p-1 rounded-md hover:bg-blue-600 transition-colors">
                <MdOutlineKeyboardArrowLeft className="text-white" size={20} />
                <span>Volver</span>
            </Link>
            <PageTitle title={`Orden ${params.id}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    <>
                        <OrderInfoSkeleton />
                        <CustomerInfoSkeleton />
                    </>
                ) : orderData ? (
                    <>
                        <OrderInfo
                            order_id={orderData.order_id}
                            delivery_state_description={orderData.delivery_state_description}
                            created_at={orderData.created_at}
                            payment={orderData.payment}
                            guide_id={orderData.guide_id}
                        />
                        <CustomerInfo 
                            customer={orderData.customer} 
                            guide_id={orderData.guide_id} 
                            delivery_state={orderData.delivery_state} 
                            order_uuid={orderData.id} 
                        />
                    </>
                ) : (
                    <div>No se encontró la orden</div>
                )}
            </div>
            {isLoading ? (
                <OrderProductsSkeleton />
            ) : orderData ? (
                <OrderProducts
                    stocks={orderData.stocks}
                    total_shipping_cost={orderData.total_shipping_cost}
                    orderId={orderData.id}
                    delivery_state={orderData.delivery_state}
                    last_state={orderData.last_state}
                />
            ) : null}
            {isLoading ? (
                <ShippingInfoSkeleton />
            ) : orderData ? (
                <ShippingInfo
                    guide_state_description={orderData.guide_state_description}
                    guide_histories={orderData.guide_histories}
                />
            ) : null}
        </div>
    );
};

export default OrderDetailPage;