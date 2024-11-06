"use client"
import React, { useState, useEffect, useCallback } from 'react';
import AdminOrderFilter from '@/app/(admin)/components/orders/AdminOrderFilter';
import AdminOrderCard from '@/app/(admin)/components/orders/AdminOrderCard';
import OrderCardSkeleton from '@/components/panel/skeletons/SkeletonOrderCard';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import { Order, fetchOrdersServer } from '@/app/(admin)/actions/orders';

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

    const loadOrders = useCallback(async (pageNum: number, isLoadingMore: boolean = false) => {
        const loadingState = isLoadingMore ? setIsLoadingMore : setIsLoading;
        loadingState(true);

        try {
            const data = await fetchOrdersServer(pageNum, limit, filters);
            
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
            loadingState(false);
        }
    }, [filters, limit]);

    useEffect(() => {
        loadOrders(1);
    }, [loadOrders]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            loadOrders(page + 1, true);
        }
    };

    const handleFilterChange = (
        start: string, 
        end: string, 
        orderIdFilter: string, 
        statusFilter: string, 
        paymentMethodFilter: string
    ) => {
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