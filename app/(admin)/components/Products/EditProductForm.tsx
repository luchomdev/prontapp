"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Toaster from '@/components/Toaster';
import type { MDXEditorMethods } from '@mdxeditor/editor';

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    level?: number;
}

interface Product {
    id: string;
    stock_id: number;
    cellar_id: number;
    discount: number | null;
    amount: number;
    name: string;
    description: string;
    reference: string;
    minimal_price: string;
    price_dropshipping: string;
    price_by_unit: string;
    images: string;
    video: string | null;
    warranty: string;
    measures: string;
    merge_by: string | null;
    category_id: string | null;
    min_qty: number;
    seo_keywords: string | null;
    seo_description: string | null;
    seo_slug: string | null;
    average_rating: string;
    rating_count: string;
}

// Componente MDXEditor inicializado separadamente para evitar SSR
const InitializedMDXEditor = dynamic(
    () => import('./InitializedMDXEditor'),
    { ssr: false }
);


const EditProductForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState<'success' | 'error'>('success');
    const [showToaster, setShowToaster] = useState(false);

    const editorRef = useRef<MDXEditorMethods>(null);


    const fetchProduct = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setToasterMessage('Error al cargar el producto');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/admin?limit=1000`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setToasterMessage('Error al cargar las categorías');
            setToasterType('error');
            setShowToaster(true);
        }
    }, []);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [fetchProduct, fetchCategories]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!product) return;
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleDescriptionChange = (content: string) => {
        if (!product) return;
        setProduct({ ...product, description: content });
    };

    const renderCategoryOptions = useCallback((categories: Category[], parentId: string | null = null, level = 0): JSX.Element[] => {
        return categories
            .filter(cat => cat.parent_id === parentId)
            .flatMap(cat => [
                <option key={cat.id} value={cat.id} style={{ paddingLeft: `${level * 20}px` }}>
                    {'\u00A0'.repeat(level * 2)}{cat.name}
                </option>,
                ...renderCategoryOptions(categories, cat.id, level + 1)
            ]);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!product) return;
        setIsSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/adjust`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    category_id: product.category_id,
                    discount: product.discount,
                    min_qty: product.min_qty,
                    seo_keywords: product.seo_keywords,
                    seo_description: product.seo_description,
                    seo_slug: product.seo_slug,
                    amount: product.amount,
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }
            setToasterMessage('Producto actualizado con éxito');
            setToasterType('success');
            setShowToaster(true);
            setTimeout(() => {
                router.push('/console/products');
            }, 2000);
        } catch (error) {
            console.error('Error updating product:', error);
            setToasterMessage(error instanceof Error ? error.message : 'Error al actualizar el producto');
            setToasterType('error');
            setShowToaster(true);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin" size={24} /></div>;
    }

    if (!product) {
        return <div>No se encontró el producto</div>;
    }

    return (
        <>
            {showToaster && (
                <Toaster
                    message={toasterMessage}
                    type={toasterType}
                    onClose={() => setShowToaster(false)}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock ID</label>
                    <input type="text" value={product.stock_id} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cellar ID</label>
                    <input type="text" value={product.cellar_id} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descuento(discount)</label>
                    <input type="text" name="discount" value={product.discount || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cantidad en Stock(amount)</label>
                    <input type="number" name="amount" value={product.amount} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre producto(name)</label>
                    <input type="text" name="name" value={product.name} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción del producto(description)</label>
                    <div className="mt-1 block w-full border border-gray-300 rounded-md bg-white">
                        <InitializedMDXEditor
                            editorRef={editorRef}
                            markdown={product.description}
                            onChange={handleDescriptionChange}
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Referencia(reference)</label>
                    <input type="text" value={product.reference} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio mínimo(minimal_price)</label>
                    <input type="text" value={product.minimal_price} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio revendedor(price_dropshipping)</label>
                    <input type="text" value={product.price_dropshipping} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio al público(price_by_unit)</label>
                    <input type="text" value={product.price_by_unit} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {JSON.parse(product.images).map((img: { url: string }, index: number) => (
                            <Image key={index} src={img.url} alt={`Product image ${index + 1}`} width={100} height={100} className="object-cover rounded" />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Video</label>
                    <input type="text" value={product.video || ''} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Garantía(warranty)</label>
                    <input type="text" value={product.warranty} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Medidas(measures)</label>
                    <input type="text" value={product.measures} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Agrupados por (merge_by)</label>
                    <input type="text" value={product.merge_by || ''} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria del producto(category_id)</label>
                    <select name="category_id" value={product.category_id || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Selecciona una categoría</option>
                        {renderCategoryOptions(categories)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Minima cantidad al carrito (min_qty)</label>
                    <input type="number" name="min_qty" value={product.min_qty} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Keywords</label>
                    <input type="text" name="seo_keywords" value={product.seo_keywords || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                    <input type="text" name="seo_description" value={product.seo_description || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Slug</label>
                    <input type="text" name="seo_slug" value={product.seo_slug || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Average Rating</label>
                    <input type="text" value={product.average_rating} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Rating Count</label>
                    <input type="text" value={product.rating_count} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>
        </>
    );
};

export default EditProductForm;