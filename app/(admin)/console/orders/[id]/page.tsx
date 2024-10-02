"use client"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminOrderInfo from '@/app/(admin)/components/orders/AdminOrderInfo';
import AdminCustomerInfo from '@/app/(admin)/components/orders/AdminCustomerInfo';
import AdminOrderProducts from '@/app/(admin)/components/orders/AdminOrderProducts';
import AdminShippingInfo from '@/app/(admin)/components/orders/AdminShippingInfo';
import Link from 'next/link';

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

const AdminOrderDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [orderData, setOrderData] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?order_id=${params.id}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch order details');
                const data = await response.json();
                setOrderData(data.orders[0]);
                console.log("OrderData : ",orderData)
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchOrderDetail();
        }
    }, [params.id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/console/orders" className="text-sm w-auto max-w-20 flex items-center bg-blue-400 text-white p-1 rounded-md hover:bg-blue-600 transition-colors mb-2">
                <MdOutlineKeyboardArrowLeft className="text-white" size={20} />
                <span>Volver</span>
            </Link>
            <h1 className="text-sm font-bold">{`Detalle de Orden ${params.id}`}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    <>
                        <OrderInfoSkeleton />
                        <CustomerInfoSkeleton />
                    </>
                ) : orderData ? (
                    <>
                        <AdminOrderInfo
                            order_id={orderData.order_id}
                            delivery_state_description={orderData.delivery_state_description}
                            created_at={orderData.created_at}
                            payment={orderData.payment}
                            guide_id={orderData.guide_id}
                        />
                        <AdminCustomerInfo 
                            customer={orderData.customer}
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
                <AdminOrderProducts
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
                <AdminShippingInfo
                    guide_state_description={orderData.guide_state_description}
                    guide_histories={orderData.guide_histories}
                />
            ) : null}
        </div>
    );
};

export default AdminOrderDetailPage;