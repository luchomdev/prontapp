import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const BrandMessage: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <p className="text-center mb-6">
        Encuentra productos de tendencia al mejor precio y calidad, envíos a toda Colombia a bajo costo.
      </p>
      <div className="text-center">
        <Link href="/" className="inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
          Explora nuestros productos
        </Link>
      </div>
    </div>
  );
};

export default BrandMessage;