// components/SearchBox.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicializar el searchTerm con el valor actual de la URL
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      setSearchTerm(currentSearch);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    router.push('/products');
  };

  return (
    <div className="hidden lg:flex flex-grow mx-4">
      <form onSubmit={handleSearch} className="relative w-full max-w-[85%] mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos . . ."
          className="w-full h-10 pl-4 pr-20 rounded-full"
        />
        {searchTerm && (
          <button 
            type="button"
            onClick={handleReset}
            className="absolute right-12 top-0 h-10 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
        <button 
          type="submit"
          className="absolute right-0 top-0 h-10 w-10 bg-[#FF8B39] rounded-r-full flex items-center justify-center"
        >
          <FaSearch className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;