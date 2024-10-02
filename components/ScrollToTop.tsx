// components/ScrollToTop.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Asumimos que el Header tiene una altura de 200px
      // Ajusta este valor según la altura real de tu Header
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-5 right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
      onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none' }}
      aria-label="Volver arriba"
    >
      <FaArrowUp className="text-xl" />
    </button>
  );
};

export default ScrollToTop;