"use client"
import React from 'react';
import { Roboto_Mono } from 'next/font/google';

const robotoMono = Roboto_Mono({ subsets: ['latin'] });

interface LogoProps {
  className?: string;
  textSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', textSize = 'lg' }) => {
  const textSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }[textSize];

  return (
    <div className={`${robotoMono.className} ${textSizeClass} font-bold text-slate-800 ${className}`}>
      NodePgNexus <span className="text-orange-500">v1</span>
    </div>
  );
};

export default Logo;