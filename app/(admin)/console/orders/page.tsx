"use client"
import React, { useState, useEffect, useCallback } from 'react';
import AdminOrderFilter from '@/app/(admin)/components/orders/AdminOrderFilter';
import AdminOrderCard from '@/app/(admin)/components/orders/AdminOrderCard';
import OrderCardSkeleton from '@/components/panel/skeletons/SkeletonOrderCard';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';

interface Order {
    id: string;
    order_id: number;
    delivery_state: number;
    delivery_state_description: string;
    customer: {
        name: string;
        email: string;
    };
    stocks: {
        [key: string]: {
            amount: number;
            price: number;
            id: string;
            name: string;
            images: Array<{ image: string; url: string }>;
        }
    };
    created_at: string;
    payment: 0 | 1;
    total_shipping_cost: string | null;
}

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        orderId: '',
        status: '',
        paymentMethod: ''
    });


    const fetchOrders = useCallback(async (pageNum: number, isLoadingMore: boolean = false) => {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        url.searchParams.append('page', pageNum.toString());
        url.searchParams.append('limit', limit.toString());
        if (filters.startDate) url.searchParams.append('start_date', filters.startDate);
        if (filters.endDate) url.searchParams.append('end_date', filters.endDate);
        if (filters.orderId) url.searchParams.append('order_id', filters.orderId);
        if (filters.status) url.searchParams.append('delivery_state', filters.status);
        if (filters.paymentMethod) url.searchParams.append('payment', filters.paymentMethod);

        try {
            const response = await fetch(url.toString(), { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            if (isLoadingMore) {
                setOrders(prevOrders => [...prevOrders, ...data.orders]);
            } else {
                setOrders(data.orders);
            }
            setTotalOrders(data.totalOrders);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [filters, limit]);

    useEffect(() => {
        fetchOrders(1);
    }, [fetchOrders]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setIsLoadingMore(true);
            fetchOrders(page + 1, true);
        }
    };

    const handleFilterChange = (start: string, end: string, orderIdFilter: string, statusFilter: string, paymentMethodFilter: string) => {
        setFilters({
            startDate: start,
            endDate: end,
            orderId: orderIdFilter,
            status: statusFilter,
            paymentMethod: paymentMethodFilter
        });
        setIsLoading(true);
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            orderId: '',
            status: '',
            paymentMethod: ''
        });
        setIsLoading(true);
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-sm font-bold">Gestionar órdenes</h1>
            <AdminOrderFilter 
                onFilterChange={handleFilterChange} 
                onResetFilters={handleResetFilters} 
            />
            <div className="space-y-4 my-8">
                {isLoading ? (
                    Array.from({ length: limit }).map((_, index) => (
                        <OrderCardSkeleton key={index} />
                    ))
                ) : (
                    orders.map((order) => (
                        <AdminOrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
            {!isLoading && (
                <LoadMoreData
                    onLoadMore={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={page < totalPages}
                />
            )}
        </div>
    );
};

export default AdminOrdersPage;