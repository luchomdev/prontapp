"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BannerImage } from '@/lib/dataLayer';

interface ImageSliderProps {
  images: BannerImage[];
  mobileImages?: BannerImage[]; // Array de imágenes para móviles (opcional)
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, mobileImages = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determinar qué conjunto de imágenes usar basado en el ancho de pantalla
  const activeImages = isMobile && mobileImages.length > 0 ? mobileImages : images;

  // Detectar el tamaño de pantalla al cargar y cuando cambia
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 580);
    };
    
    // Comprobar al montar
    handleResize();
    
    // Añadir event listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Asegurarse de que el índice actual sea válido si cambia el conjunto de imágenes
  useEffect(() => {
    if (currentIndex >= activeImages.length && activeImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [isMobile, activeImages.length, currentIndex]);

  // Simular un breve período de carga al cambiar entre conjuntos de imágenes
  useEffect(() => {
    setIsLoading(true);
    
    // Solo mostrar skeleton brevemente si ya tenemos imágenes disponibles
    if (activeImages.length > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, activeImages]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeImages.length) % activeImages.length);
  };

  if (activeImages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] sm:h-[360px] overflow-hidden transition-all duration-300">
      {isLoading ? (
        // Skeleton loader
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Link href={activeImages[currentIndex].link} className="block w-full h-full relative">
            <Image
              src={activeImages[currentIndex].image_data}
              alt={activeImages[currentIndex].title}
              fill
              sizes={isMobile ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
              quality={90}
              onLoadingComplete={() => setIsLoading(false)}
            />
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              goToPrevious();
            }}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 p-1 sm:p-2 rounded-full z-10 transition-all duration-200 focus:outline-none"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 p-1 sm:p-2 rounded-full z-10 transition-all duration-200 focus:outline-none"
            aria-label="Next image"
          >
            <FaChevronRight className="text-sm sm:text-base" />
          </button>
          
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
            {activeImages.map((_, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-gray-300 bg-opacity-70 hover:bg-opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                role="button"
                tabIndex={0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;