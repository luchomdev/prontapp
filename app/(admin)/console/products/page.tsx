"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from "next/link";
import { FaWarehouse, FaObjectGroup, FaSpinner, FaGrinStars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ProductCard from '@/app/(admin)/components/Products/ProductCard';
import ProductFilter from '@/app/(admin)/components/Products/ProductFilter';
import LoadMoreData from '@/app/(admin)/components/LoadMoreData';
import Toaster from '@/components/Toaster';
import { useStore } from '@/stores/cartStore';

interface Product {
    id: string;
    name: string;
    stock_id: string;
    product_id: string;
    amount: number;
    price_by_unit: number | string | null;
    price_dropshipping: number | string;
    images: string;
    merge_by: string | null;
    discount: number | string | null;
    precio_final: number | string | null;
    category_name: string;
    average_rating: number | string | null;
    rating_count: number | string;
}

interface FilterParams {
    stockId: string | null;
    search: string;
    category_id: string | null;
}

const ProductsAdminPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filterParams, setFilterParams] = useState<FilterParams>({
        stockId: null,
        search: '',
        category_id: null
    });
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const isInitialMount = useRef(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isGrouping, setIsGrouping] = useState(false);
    const productsToGroup = useStore(state => state.productsToGroup);
    const clearProductsToGroup = useStore(state => state.clearProductsToGroup);

    const handleSessionExpired = useCallback(() => {
        setToasterMessage('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
        setToasterType('error');
        setShowToaster(true);
        setTimeout(() => {
            router.push('/auth/signin');
        }, 3000);
    }, [router]);

    const fetchProducts = useCallback(async (loadMore = false) => {
        if (loadMore) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }
        const currentPage = loadMore ? page + 1 : 1;
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
            });

            if (filterParams.stockId) queryParams.append('stockId', filterParams.stockId);
            if (filterParams.search) queryParams.append('search', filterParams.search);
            if (filterParams.category_id) queryParams.append('category_id', filterParams.category_id);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams}`, {
                credentials: 'include'
            });
            if (response.status === 401) {
                handleSessionExpired();
                return;
            }

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log('Productos recibidos:', data);

            if (loadMore) {
                setProducts(prevProducts => [...prevProducts, ...data.products]);
            } else {
                setProducts(data.products);
            }

            setPage(currentPage);
            setTotalPages(data.totalPages);
            setHasMore(currentPage < data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            setToasterMessage('Error al cargar los productos. Por favor, intente nuevamente.');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [filterParams, page, limit, router]);
    useEffect(() => {
        fetchProducts();
    }, [filterParams]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchProducts();
        }
    }, [fetchProducts]);

    const handleEditProduct = useCallback((productId: string) => {
        router.push(`/console/products/edit/${productId}`)
    }, []);

    const handleGroupProducts = async () => {
        if (productsToGroup.length < 2) return;

        setIsGrouping(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/merge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productIds: productsToGroup }),
            });

            if (!response.ok) {
                throw new Error('Error al agrupar productos');
            }

            setToasterMessage('Productos agrupados exitosamente');
            setToasterType('success');
            setShowToaster(true);
            clearProductsToGroup();
            fetchProducts();
        } catch (error) {
            console.error('Error grouping products:', error);
            setToasterMessage('Error al agrupar productos. Por favor, intente nuevamente.');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsGrouping(false);
        }
    };

    const handleFilterChange = (newFilterParams: FilterParams) => {
        setFilterParams(newFilterParams);
        setPage(1);
    };

    const handleLoadMore = useCallback(() => {
        if (page < totalPages && !isLoadingMore) {
            fetchProducts(true);
        }
    }, [page, totalPages, isLoadingMore, fetchProducts]);

    return (
        <div className="p-6">
            
            {showToaster && (
                <Toaster
                    message={toasterMessage}
                    type={toasterType}
                    onClose={() => setShowToaster(false)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-sm font-bold">Gestionar Productos</h1>
                <div className="flex justify-normal items-center space-x-2">
                    <Link href="/console/products/megabodega" title='Buscar en la Megabodega' className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center mr-2">
                        <FaWarehouse className="mr-2 text-sm" /> Bodega Productos
                    </Link>
                    <button 
                        className={`bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center ${productsToGroup.length < 2 || isGrouping ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleGroupProducts}
                        disabled={productsToGroup.length < 2 || isGrouping}
                    >
                        <FaObjectGroup className="mr-2 text-sm" /> 
                        {isGrouping ? 'Agrupando...' : 'Agrupar Productos'}
                    </button>
                    <Link href="/console/products/pending-star" title='Aprobar valoraciones realizadas' className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center mr-2">
                        <FaGrinStars className="mr-2 text-sm" /> Aprobar valoraciones
                    </Link>
                </div>
            </div>
            <hr className="my-4 border-gray-300" />
            <ProductFilter onFilterChange={handleFilterChange} />
            <div className="space-y-4 mt-4">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={handleEditProduct}
                        //onGroup={handleGroupProducts}
                    />
                ))}
                {isLoading && !isLoadingMore && (
                    <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin text-blue-500" size={24} />
                        <span className="ml-2">Cargando productos...</span>
                    </div>
                )}
            </div>
            {!isLoading && (
                <LoadMoreData
                    onLoadMore={handleLoadMore}
                    isLoading={isLoadingMore}
                    hasMore={hasMore}
                />
            )}
        </div>
    );
};

export default ProductsAdminPage;