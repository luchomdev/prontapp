import React from 'react';
import Image from 'next/image';

interface SpecialProductsShowImageProps {
    title: string;
    image: string;
}

const SpecialProductsShowImage: React.FC<SpecialProductsShowImageProps> = ({ title, image }) => {
    return (
        <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-64">
            <Image
                src={image}
                alt={title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 100vw, 
                       (max-width: 768px) 100vw, 
                       (max-width: 1024px) 100vw,
                       100vw"
                className="transition-transform duration-300"
                quality={90}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
                    {title}
                </h1>
            </div>
        </div>
    );
};

export default SpecialProductsShowImage;