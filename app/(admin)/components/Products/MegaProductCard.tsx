import React from 'react';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

interface MegaProduct {
    id: string;
    name: string;
    product_id: string;
    cellar_id: number;
    amount: number;
    reference:string;
    price_by_unit: number | string | null;
    price_dropshipping: number | string;
    images: string;
    discount: number | string | null;
    description: string;
    measures: string;
    video:string;
    warranty:string;
}

interface MegaProductCardProps {
    product: MegaProduct;
    onImport: (product: MegaProduct) => void;
    isImporting: boolean;
}

const MegaProductCard: React.FC<MegaProductCardProps> = React.memo(({ product, onImport, isImporting }) => {
    const handleImport = () => onImport(product);

    const formatPrice = (price: number | string | null) => {
        if (price == null) return 'N/A';
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numericPrice) ? `$${numericPrice.toFixed(0)}` : 'N/A';
    };

    const images = JSON.parse(product.images);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-start">
            <div className="flex items-start">
                <div className="flex flex-wrap gap-2 mr-4">
                    {images.map((image: { url: string }, index: number) => (
                        <div key={index} className="w-16 h-16 relative">
                            <Image
                                src={image.url || '/placeholder-image.jpg'}
                                alt={`${product.name} - imagen ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 64px, 64px"
                                style={{ objectFit: 'cover' }}
                                className="rounded"
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500">Producto ID: {product.product_id}</p>
                    <p className="text-xs text-gray-500">Stock ID: {product.id}</p>
                    <p className="text-xs text-gray-500">Cellar ID: {product.cellar_id}</p>
                    <p className="text-xs text-gray-500">Referencia: {product.reference}</p>
                    <p className="text-xs text-gray-500">Cantidad: {product.amount}</p>
                    <p className="text-xs text-gray-500">Precio costo: {formatPrice(product.price_dropshipping)}</p>
                    <p className="text-xs text-gray-500">Precio por unidad: {formatPrice(product.price_by_unit)}</p>
                    {product.discount != null && Number(product.discount) > 0 && (
                        <p className="text-xs text-red-500">Descuento: {product.discount}%</p>
                    )}
                    <p className="text-xs font-semibold">Precio final: {formatPrice(product.price_by_unit)}</p>
                    <p className="text-xs text-gray-500 mt-2">Descripción: {product.description}</p>
                    <p className="text-xs text-gray-500">Medidas: {product.measures}</p>
                    <p className="text-xs text-gray-500">Garantía: {product.warranty}</p>
                </div>
            </div>
            <button
                onClick={handleImport}
                disabled={isImporting}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isImporting ? (
                    <>
                        <FaSpinner className="animate-spin mr-2" />
                        Importando...
                    </>
                ) : (
                    'IMPORTAR'
                )}
            </button>
        </div>
    );
});

MegaProductCard.displayName = 'MegaProductCard';

export default MegaProductCard;