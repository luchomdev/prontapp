"use client"
import React, { useState, useEffect, useCallback } from 'react';
import PageTitle from '@/components/panel/PageTitle';
import OrderFilter from '@/components/panel/OrderFilter';
import OrderCard from '@/components/panel/OrderCard';
import OrderCardSkeleton from '@/components/panel/skeletons/SkeletonOrderCard';
import LoadMoreButton from '@/components/panel/LoadMoreButton';
import { fetchOrders } from '@/app/actions/orders';

interface Order {
    order_id: number;
    delivery_state_description: string;
    customer: {
        name: string;
        email: string;
    };
    stocks: {
        [key: string]: {
            amount: number;
            price: number;
        }
    };
    created_at: string;
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadInitialOrders = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchOrders(1, limit);
        if (data) {
            setOrders(data.orders);
            setTotalOrders(data.totalOrders);
            setPage(1);
        }
        setIsLoading(false);
    }, [limit]);

    useEffect(() => {
        loadInitialOrders();
    }, [loadInitialOrders]);

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        const nextPage = page + 1;
        const data = await fetchOrders(nextPage, limit, startDate, endDate, orderId);
        if (data) {
            setOrders(prevOrders => [...prevOrders, ...data.orders]);
            setPage(nextPage);
        }
        setIsLoadingMore(false);
    };

    const handleFilterChange = async (start: string, end: string, orderIdFilter: string) => {
        setIsLoading(true);
        setStartDate(start);
        setEndDate(end);
        setOrderId(orderIdFilter);
        const data = await fetchOrders(1, limit, start, end, orderIdFilter);
        if (data) {
            setOrders(data.orders);
            setPage(1);
            setTotalOrders(data.totalOrders);
        }
        setIsLoading(false);
    };

    const handleResetFilters = async () => {
        setIsLoading(true);
        setStartDate('');
        setEndDate('');
        setOrderId('');
        const data = await fetchOrders(1, limit);
        if (data) {
            setOrders(data.orders);
            setPage(1);
            setTotalOrders(data.totalOrders);
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle title="Mis órdenes" />
            <OrderFilter onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
            <div className="space-y-4 my-8">
                {isLoading ? (
                    Array.from({ length: limit }).map((_, index) => (
                        <OrderCardSkeleton key={index} />
                    ))
                ) : (
                    orders.map((order) => (
                        <OrderCard key={order.order_id} order={order} />
                    ))
                )}
                {isLoadingMore && (
                    Array.from({ length: limit }).map((_, index) => (
                        <OrderCardSkeleton key={`loading-more-${index}`} />
                    ))
                )}
            </div>
            {!isLoading && orders.length < totalOrders && (
                <LoadMoreButton onLoadMore={handleLoadMore} isLoading={isLoadingMore} />
            )}
        </div>
    );
};

export default OrdersPage;