"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BannerImage } from '@/lib/dataLayer';

interface ImageSliderProps {
  images: BannerImage[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] sm:h-[350px] overflow-hidden transition-all duration-300">
      <Link href={images[currentIndex].link} className="block w-full h-full relative">
        <Image
          src={images[currentIndex].image_data}
          alt={images[currentIndex].title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
          quality={90}
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
        {images.map((_, index) => (
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
    </div>
  );
};

export default ImageSlider;