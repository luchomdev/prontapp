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
import { 
  Product, 
  fetchProductsServer, 
  mergeProductsServer 
} from '@/app/(admin)/actions/products';


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
    const [isGrouping, setIsGrouping] = useState(false);
    const productsToGroup = useStore(state => state.productsToGroup);
    const clearProductsToGroup = useStore(state => state.clearProductsToGroup);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const isLoadingRef = useRef(isLoading);
    const isLoadingMoreRef = useRef(isLoadingMore);
    const pageRef = useRef(page);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        isLoadingMoreRef.current = isLoadingMore;
    }, [isLoadingMore]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    const handleSessionExpired = useCallback(() => {
        setToasterMessage('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
        setToasterType('error');
        setShowToaster(true);
        setTimeout(() => {
            router.push('/auth/signin');
        }, 3000);
    }, [router]);

    const fetchProducts = useCallback(async (loadMore = false) => {
        if (isLoadingRef.current || isLoadingMoreRef.current) return;

        const loadingState = loadMore ? setIsLoadingMore : setIsLoading;
        loadingState(true);

        const currentPage = loadMore ? pageRef.current + 1 : 1;
        try {
            const data = await fetchProductsServer(
                currentPage,
                limit,
                filterParams.stockId,
                filterParams.search,
                filterParams.category_id
            );

            setProducts(prevProducts => loadMore ? [...prevProducts, ...data.products] : data.products);
            setPage(currentPage);
            setTotalPages(data.totalPages);
            setHasMore(currentPage < data.totalPages);
        } catch (error: any) {
            if (error.message === '401') {
                handleSessionExpired();
                return;
            }
            console.error('Error fetching products:', error);
            setToasterMessage('Error al cargar los productos. Por favor, intente nuevamente.');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            loadingState(false);
        }
    }, [filterParams, limit, handleSessionExpired]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setPage(1);
            pageRef.current = 1;
        }
        fetchProducts();
    }, [filterParams, fetchProducts]);

    const handleEditProduct = useCallback((productId: string) => {
        router.push(`/console/products/edit/${productId}`)
    }, [router]);

    const handleGroupProducts = async () => {
        if (productsToGroup.length < 2 || isGrouping) return;

        setIsGrouping(true);
        try {
            const success = await mergeProductsServer(productsToGroup);
            
            if (success) {
                setToasterMessage('Productos agrupados exitosamente');
                setToasterType('success');
                setShowToaster(true);
                clearProductsToGroup();
                fetchProducts();
            } else {
                throw new Error('Error al agrupar productos');
            }
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
    };

    const handleLoadMore = useCallback(() => {
        if (pageRef.current < totalPages && !isLoadingMoreRef.current && !isLoadingRef.current) {
            fetchProducts(true);
        }
    }, [totalPages, fetchProducts]);
    
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
                    />
                ))}
                {(isLoading || isLoadingMore) && (
                    <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin text-blue-500" size={24} />
                        <span className="ml-2">Cargando productos...</span>
                    </div>
                )}

                {!isLoading && (
                    <LoadMoreData
                        onLoadMore={handleLoadMore}
                        isLoading={isLoadingMore}
                        hasMore={hasMore}
                    />
                )}
            </div>
        </div>)
};

export default ProductsAdminPage;