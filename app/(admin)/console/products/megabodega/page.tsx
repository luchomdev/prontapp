"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MegaProductCard from '@/app/(admin)/components/Products/MegaProductCard';
import MegaProductFilter from '@/app/(admin)/components/Products/MegaProductFilter';
import MegaLoadMoreData from '@/app/(admin)/components/MegaLoadMoreData';
import Toaster from '@/components/Toaster';

interface MegaProduct {
    id: string;
    name: string;
    product_id: string;
    cellar_id: number;
    reference:string;
    amount: number;
    price_by_unit: number | string | null;
    price_dropshipping: number | string;
    images: string;
    discount: number | string | null;
    description: string;
    measures: string;
    video:string;
    warranty:string;
}

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

    const fetchProducts = useCallback(async (loadMore = false) => {
        setIsLoading(true);
        const currentPage = loadMore ? page + 1 : 1;
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                ...filterParams
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/hoko-products?${queryParams}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            
            if (loadMore) {
                setProducts(prevProducts => [...prevProducts, ...data.data]);
            } else {
                setProducts(data.data);
            }

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
    }, [filterParams, page]);

    useEffect(() => {
        fetchProducts();
    }, [filterParams]);

    const handleFilterChange = (newFilterParams: FilterParams) => {
        setFilterParams(newFilterParams);
        setPage(1);
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchProducts(true);
        }
    };

    const handleImport = useCallback(async (product: MegaProduct) => {
        setImportingProducts(prev => ({ ...prev, [product.id]: true }));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/import-hoko-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ products: [product] }),
            });

            if (!response.ok) {
                throw new Error('Error al importar el producto');
            }

            setToasterMessage('Producto importado exitosamente');
            setToasterType('success');
            setShowToaster(true);
            
        } catch (error) {
            console.error('Error importing product:', error);
            setToasterMessage('Error al importar el producto. Por favor, intente nuevamente.');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setImportingProducts(prev => ({ ...prev, [product.id]: false }));
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