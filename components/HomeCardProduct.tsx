"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { ProductOrProductForHome, parseProductImages } from '@/lib/dataLayer';
import { useStore } from '@/stores/cartStore';
import Toaster from '@/components/Toaster';
import { formatCurrency } from '@/lib/Helpers';

interface HomeCardProductProps {
  product: ProductOrProductForHome;
}

const HomeCardProduct: React.FC<HomeCardProductProps> = ({ product }) => {
  const images = parseProductImages(product.images);
  const mainImage = images.length > 0 ? images[0].url : '/placeholder.jpg';
  const addToCart = useStore((state) => state.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    let parsedMeasures: { [key: string]: string };
    if (typeof product.measures === 'string') {
      try {
        parsedMeasures = JSON.parse(product.measures);
      } catch (error) {
        console.error('Error parsing measures:', error);
        parsedMeasures = {}; // Fallback to empty object if parsing fails
      }
    } else {
      parsedMeasures = product.measures;
    }

    addToCart(product.stock_id, {
      name: product.name,
      cantidad: product.min_qty,
      minQuantity:product.min_qty,
      precio: Number(product.precio_final),
      thumbnail: images[0]?.url || '/placeholder.jpg',
      subtotal: Number(product.precio_final),
      measures: parsedMeasures
    });

    setIsAddingToCart(true);
    setShowToast(true);

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 5000);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="border border-gray-200 rounded-md p-2 flex flex-col max-w-[190px]">
      <h3 className="text-xs md:text-sm font-semibold mb-1 truncate">{product.name}</h3>
      <Link href={`/product/${product.id}/${product.seo_slug ? product.seo_slug : ''}`} className="relative w-full aspect-square mb-2 md:mb-3 max-w-[150px] md:max-w-full mx-auto">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 150px, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="rounded-md"
        />
      </Link>
      <div className="flex justify-between items-center mb-1 md:mb-2">
        {product.price_fake_discount ? (
          <>
            <span className="line-through text-red-500 text-2xs md:text-xs">{formatCurrency(Number(product.price_fake_discount))}</span>
            <span className="font-bold text-xs md:text-sm">{formatCurrency(Number(product.precio_final))}</span>
          </>
        ) : (
          <span className="font-bold text-xs md:text-sm">{formatCurrency(Number(product.precio_final))}</span>
        )}
      </div>
      <div className="flex items-center mb-1 md:mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-xs md:text-sm ${star <= Number(product.average_rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 stroke-current'
            }`}>★</span>
        ))}
        <span className="text-2xs md:text-xs ml-1">({product.rating_count})</span>
      </div>
      <div className="flex flex-col space-y-1 md:space-y-2 mb-2 md:mb-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full bg-orange-500 text-white p-1 rounded text-2xs md:text-xs flex items-center justify-center ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
        >
          <FaShoppingCart className="mr-1" /> {isAddingToCart ? 'Agregado...' : 'Agregar'}
        </button>
        <Link
          href={`/product/${product.id}/${product.seo_slug ? product.seo_slug : ''}`}
          className="w-full bg-orange-500 text-white p-1 rounded text-2xs md:text-xs flex items-center justify-center hover:bg-orange-600"
        >
          <FaEye className="mr-1" /> Más Info...
        </Link>
      </div>
      {product.variants.length > 0 && (
        <div className="flex space-x-1 overflow-x-auto">
          {product.variants.map((variant) => {
            const variantImages = parseProductImages(variant.images);
            const variantImage = variantImages.length > 0 ? variantImages[0].url : '/placeholder.jpg';
            return (
              <div key={variant.id} className="w-8 h-8 md:w-12 md:h-12 relative flex-shrink-0">
                <Image
                  src={variantImage}
                  alt={product.name + ' ' + variant.id}
                  fill
                  sizes="(max-width: 768px) 32px, 48px"
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
              </div>
            );
          })}
        </div>
      )}
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

export default HomeCardProduct;