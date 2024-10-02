import React from 'react';
import Image from 'next/image';
import { FaEdit, FaObjectGroup, FaStar } from 'react-icons/fa';
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

interface ProductCardProps {
    product: Product;
    onEdit: (id: string) => void;
    //onGroup: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onEdit }) => {
    const addProductsToGroups = useStore(state => state.addProductsToGroups);
    const productsToGroup = useStore(state => state.productsToGroup);
    const isSelected = productsToGroup.includes(product.id);

    const handleEdit = () => onEdit(product.id);
    //const handleGroup = () => onGroup(product.id);

    const formatPrice = (price: number | string | null) => {
        if (price == null) return 'N/A';
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numericPrice) ? `$${numericPrice.toFixed(0)}` : 'N/A';
    };

    const formatRating = (rating: number | string | null) => {
        if (rating == null) return 'N/A';
        const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
        return !isNaN(numericRating) ? numericRating.toFixed(1) : 'N/A';
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 relative">
                    <Image
                        src={JSON.parse(product.images)[0].url || '/placeholder-image.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 64px, 64px"
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500">ID: {product.product_id}</p>
                    <p className="text-xs text-gray-500">Stock ID: {product.stock_id}</p>
                    <p className="text-xs text-gray-500">Categoría: {product.category_name || 'Sin categoría'}</p>
                    <p className="text-xs text-gray-500">Cantidad: {product.amount}</p>
                    <p className="text-xs text-gray-500">Precio costo: {formatPrice(product.price_dropshipping)}</p>
                    <p className="text-xs text-gray-500">Precio por unidad: {formatPrice(product.price_by_unit)}</p>
                    {product.discount != null && Number(product.discount) > 0 && (
                        <p className="text-xs text-red-500">Descuento: {product.discount}%</p>
                    )}
                    <p className="text-xs font-semibold">Precio final: {formatPrice(product.price_by_unit)}</p>
                    <div className="flex items-center mt-1">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-xs">
                            {formatRating(product.average_rating)}
                            ({typeof product.rating_count === 'number' ? product.rating_count : parseInt(product.rating_count) || 0} calificaciones)
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <button
                    onClick={handleEdit}
                    className="text-blue-500 hover:text-blue-700"
                    title="Editar"
                >
                    <FaEdit size={20} />
                </button>
                <button
                    onClick={() => addProductsToGroups(product.id)}
                    className={`${isSelected ? 'text-blue-500' : 'text-green-500'} hover:text-blue-700`}
                    title={isSelected ? "Clic para Desagrupar" : "Seleccionar para agrupar"}
                >
                    <FaObjectGroup size={20} />
                </button>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;