"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { parseProductImages } from '@/lib/dataLayer';

interface SearchResult {
  id: string;
  name: string;
  precio_final: string;
  images: string;
}

interface ModalSearchMiniProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (productId: string) => void;
}

const ModalSearchMini: React.FC<ModalSearchMiniProps> = ({ isOpen, onClose, onProductClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const searchProducts = useCallback(async (term: string) => {
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/public?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSearchResults(data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        precio_final: product.precio_final,
        images: product.images
      })));
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((term: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchProducts(term);
    }, 300);
  }, [searchProducts]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const resetSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleProductClick = (productId: string) => {
    onProductClick(productId);
    // No reseteamos la búsqueda aquí para mantener el contexto
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      <div className="bg-white p-4">
        <div className="flex items-center mb-4">
          <button onClick={onClose} className="mr-4">
            <FaTimes size={24} />
          </button>
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={resetSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto bg-gray-100 p-4">
        {isLoading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => {
            const images = parseProductImages(result.images);
            const mainImage = images.length > 0 ? images[0].url : '/placeholder.jpg';
            return (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center cursor-pointer"
                onClick={() => handleProductClick(result.id)}
              >
                <div className="w-16 h-16 relative mr-4 flex-shrink-0">
                  <Image
                    src={mainImage}
                    alt={result.name}
                    fill
                    sizes="(max-width: 768px) 64px, 64px"
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{result.name}</h3>
                  <p className="text-orange-500">${parseFloat(result.precio_final).toFixed(2)}</p>
                </div>
              </div>
            );
          })
        ) : (
          searchTerm.trim() !== '' && <div className="text-center py-4">No se encontraron resultados</div>
        )}
      </div>
    </div>
  );
};

export default ModalSearchMini;