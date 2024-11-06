"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import Toaster from '@/components/Toaster';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import { 
    Rating, 
    fetchPendingRatingsServer, 
    approveRatingServer 
} from '@/app/(admin)/actions/products';

interface PaginationInfo {
    totalRatings: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

const PendingRatingsPage: React.FC = () => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        totalRatings: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const router = useRouter();

    const loadRatings = useCallback(async (page: number = 1) => {
        const loadingState = page === 1 ? setIsLoading : setIsLoadingMore;
        loadingState(true);
        
        try {
            const data = await fetchPendingRatingsServer(page);
            
            if (page === 1) {
                setRatings(data.ratings);
            } else {
                setRatings(prevRatings => [...prevRatings, ...data.ratings]);
            }
            
            setPaginationInfo({
                totalRatings: data.totalRatings,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                limit: data.limit
            });
        } catch (error) {
            console.error('Error fetching ratings:', error);
            setToastMessage('Error al cargar las valoraciones');
            setToastType('error');
        } finally {
            loadingState(false);
        }
    }, []);

    useEffect(() => {
        loadRatings();
    }, [loadRatings]);

    const handleLoadMore = () => {
        if (paginationInfo.currentPage < paginationInfo.totalPages) {
            loadRatings(paginationInfo.currentPage + 1);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const success = await approveRatingServer(id);
            
            if (success) {
                setToastMessage('Valoración aprobada exitosamente');
                setToastType('success');
                setRatings(prevRatings => prevRatings.filter(rating => rating.id !== id));
                setPaginationInfo(prev => ({
                    ...prev,
                    totalRatings: prev.totalRatings - 1
                }));
                setTimeout(() => {
                    router.push('/console/products');
                }, 2000);
            } else {
                throw new Error('Failed to approve rating');
            }
        } catch (error) {
            console.error('Error approving rating:', error);
            setToastMessage('Error al aprobar la valoración');
            setToastType('error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-sm font-bold mb-6">Aprobar valoraciones realizadas a los productos</h1>
                <Link
                    href="/console/products"
                    className="bg-red-400 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded"
                >
                    Cancelar
                </Link>
            </div>
    
            {isLoading && ratings.length === 0 ? (
                <p>Cargando valoraciones...</p>
            ) : (
                <div className="space-y-4">
                    {ratings.length > 0 ? (
                        ratings.map((rating) => (
                            <div
                                key={rating.id}
                                className="bg-white shadow-md rounded-lg p-4"
                            >
                                <h2 className="font-semibold">{rating.product_name}</h2>
                                <p>Calificación: {rating.rating}/5</p>
                                <p>Comentario: {rating.comment}</p>
                                <p>Usuario: {rating.user_name}</p>
                                <p>Fecha: {new Date(rating.created_at).toLocaleDateString()}</p>
                                <button
                                    onClick={() => handleApprove(rating.id)}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Aprobar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay valoraciones pendientes de aprobación.</p>
                    )}
                </div>
            )}

            {ratings.length > 0 && paginationInfo.currentPage < paginationInfo.totalPages && (
                <LoadMoreData
                    onLoadMore={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={paginationInfo.currentPage < paginationInfo.totalPages}
                />
            )}

            {toastMessage && (
                <Toaster
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </div>
    );
};

export default PendingRatingsPage;