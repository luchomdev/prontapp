"use client"
import React, { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import VariantSelector from '@/components/VariantSelector';
import QuantitySelector from '@/components/QuantitySelector';
import ShippingEstimate from '@/components/ShippingEstimate';
import SkeletonShippingEstimate from '@/components/skeletons/SkeletonShippingEstimate';
import ReviewList from '@/components/ReviewList';
import RelatedProducts from '@/components/RelatedProducts';
import ProductDescription from '@/components/ProductDescription';
import ProductWarranty from '@/components/ProductWarranty';
import RecentlyViewed from '@/components/RecentlyViewed';
import Toaster from '@/components/Toaster';
import { ProductDetail, ProductOrProductForHome, ProductVariant, parseMeasures } from '@/lib/dataLayer';
import { useStore } from '@/stores/cartStore';
import { getShippingQuote } from '@/app/actions/shipping';


interface ProductDetailProps {
    product: ProductDetail;
    relatedProducts: ProductOrProductForHome[]
}

const ProductDetailComp: React.FC<ProductDetailProps> = ({ product, relatedProducts }) => {
    const [selectedVariant, setSelectedVariant] = useState<ProductDetail>(product);
    const [quantity, setQuantity] = useState(product.min_qty);
    const addToCart = useStore((state) => state.addToCart);
    const addToRecentlyViewed = useStore((state) => state.addToRecentlyViewed);
    const openCartSidebar = useStore((state) => state.openCartSidebar);
    const shippingAddress = useStore((state) => state.shippingAddress);
    const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);
    const [isLoadingShippingEstimate, setIsLoadingShippingEstimate] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant({ ...product, ...variant });
    };
    const handleAddToCart = () => {
        addToCart(selectedVariant.stock_id, {
            name: selectedVariant.name,
            cantidad: quantity,
            minQuantity:product.min_qty,
            precio: parseFloat(selectedVariant.precio_final.toString()),
            thumbnail: JSON.parse(selectedVariant.images)[0]?.url || '/placeholder.jpg',
            subtotal: quantity * parseFloat(selectedVariant.precio_final.toString()),
            measures: parseMeasures(selectedVariant.measures)

        });

        setIsAddingToCart(true);
        setShowToast(true);
        openCartSidebar();

        setTimeout(() => {
            setIsAddingToCart(false);
        }, 5000);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    useEffect(() => {
        addToRecentlyViewed({
            id: product.id,
            name: product.name,
            price: parseFloat(product.precio_final.toString()),
            stock_id: product.stock_id,
            thumbnail: JSON.parse(product.images)[0]?.url || '/placeholder.jpg',
        });
    }, [product, addToRecentlyViewed]);

    useEffect(() => {
        const fetchShippingEstimate = async () => {
            if (shippingAddress) {
                setIsLoadingShippingEstimate(true);
                setShippingEstimate(null);
                try {
                    const shippingValue = await getShippingQuote(
                        [selectedVariant.stock_id],
                        shippingAddress.city_id,
                        1
                    );
                    
                    if (shippingValue !== null) {
                        setShippingEstimate(shippingValue.quotations[0].shipping_value);
                    }
                } catch (error) {
                    console.error('Error fetching shipping estimate:', error);
                } finally {
                    setIsLoadingShippingEstimate(false);
                }
            }
        };

        fetchShippingEstimate();
    }, [shippingAddress, selectedVariant.stock_id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductGallery images={selectedVariant.images} />
                <div>
                    <ProductInfo
                        name={selectedVariant.name}
                        rating={selectedVariant.average_rating}
                        ratingCount={selectedVariant.rating_count}
                        amount={selectedVariant.amount}
                        price={selectedVariant.precio_final.toString()}
                        price_by_unit={selectedVariant.price_by_unit.toString()}
                        price_fake_discount={selectedVariant.price_fake_discount ? selectedVariant.price_fake_discount.toString() : null}
                    />
                    {shippingAddress && (
                        isLoadingShippingEstimate ? (
                            <SkeletonShippingEstimate />
                        ) : shippingEstimate !== null ? (
                            <ShippingEstimate
                                cityName={shippingAddress.cityName}
                                shippingCost={shippingEstimate}
                            />
                        ) : null
                    )}
                    <VariantSelector
                        variants={[product, ...product.variants]}
                        selectedVariant={selectedVariant}
                        onSelect={handleVariantSelect}
                    />
                    <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                        maxQuantity={parseInt(selectedVariant.amount)}
                        minQuantity={product.min_qty}
                        stock_id={selectedVariant.stock_id}
                    />
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        {isAddingToCart ? 'Agregado al carrito...' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
            <ProductDescription description={product.description} />
            <ProductWarranty warranty={product.warranty} />
            <ReviewList reviews={product.ratings} />
            <RelatedProducts products={relatedProducts} />
            <RecentlyViewed />
            {showToast && (
                <Toaster
                    message="Producto agregado al carrito"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default ProductDetailComp;