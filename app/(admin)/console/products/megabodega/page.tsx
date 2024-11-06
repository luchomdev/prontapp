"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MegaProductCard from '@/app/(admin)/components/Products/MegaProductCard';
import MegaProductFilter from '@/app/(admin)/components/Products/MegaProductFilter';
import MegaLoadMoreData from '@/app/(admin)/components/MegaLoadMoreData';
import Toaster from '@/components/Toaster';
import { 
    MegaProduct, 
    fetchMegaProductsServer, 
    importMegaProductServer 
} from '@/app/(admin)/actions/megabodega';

interface FilterParams {
    search: string;
    stockID: string;
    groupByStockID: string;
    sortBy: string;
}

const MegaBodegaPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState<MegaProduct[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filterParams, setFilterParams] = useState<FilterParams>({
        search: '',
        stockID: '',
        groupByStockID: '',
        sortBy: '1'
    });
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);
    const [importingProducts, setImportingProducts] = useState<{ [key: string]: boolean }>({});

    const pageRef = useRef(page);
    const isLoadingRef = useRef(isLoading);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    const fetchProducts = useCallback(async (loadMore = false) => {
        if (isLoadingRef.current) return;

        setIsLoading(true);
        const currentPage = loadMore ? pageRef.current + 1 : 1;
        
        try {
            const data = await fetchMegaProductsServer(currentPage, filterParams);
            
            setProducts(prevProducts => loadMore ? [...prevProducts, ...data.data] : data.data);
            setPage(currentPage);
            setHasMore(currentPage < data.last_page);
        } catch (error) {
            console.error('Error fetching products:', error);
            setToasterMessage('Error al cargar los productos. Por favor, intente nuevamente.');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsLoading(false);
        }
    }, [filterParams]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = useCallback((newFilterParams: FilterParams) => {
        setFilterParams(newFilterParams);
        setPage(1);
        pageRef.current = 1;
    }, []);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingRef.current && hasMore) {
            fetchProducts(true);
        }
    }, [hasMore, fetchProducts]);

    const handleImport = useCallback(async (product: MegaProduct) => {
        setImportingProducts(prev => ({ ...prev, [product.id]: true }));
        try {
            const success = await importMegaProductServer(product);
            
            if (success) {
                setToasterMessage('Producto importado exitosamente');
                setToasterType('success');
            } else {
                throw new Error('Error al importar el producto');
            }
        } catch (error) {
            console.error('Error importing product:', error);
            setToasterMessage('Error al importar el producto. Por favor, intente nuevamente.');
            setToasterType('error');
        } finally {
            setImportingProducts(prev => ({ ...prev, [product.id]: false }));
            setShowToaster(true);
        }
    }, []);

    return (
        <div className="p-6">
            {showToaster && (
                <Toaster
                    message={toasterMessage}
                    type={toasterType}
                    onClose={() => setShowToaster(false)}
                />
            )}
            <h1 className="text-sm font-bold mb-6">Productos Mega Bodega</h1>
            <MegaProductFilter onFilterChange={handleFilterChange} />
            <div className="space-y-4 mt-4">
                {products.map(product => (
                    <MegaProductCard
                        key={product.id}
                        product={product}
                        onImport={handleImport}
                        isImporting={importingProducts[product.id] || false}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin text-blue-500" size={24} />
                        <span className="ml-2">Cargando productos...</span>
                    </div>
                )}
            </div>
            {!isLoading && hasMore && (
                <MegaLoadMoreData
                    onLoadMore={handleLoadMore}
                    isLoading={isLoading}
                    hasMore={hasMore}
                />
            )}
        </div>
    );
};

export default MegaBodegaPage;