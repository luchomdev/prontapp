"use client"
import React from 'react';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore, isLoading }) => {
  return (
    <div className="text-center mt-8">
      <button 
        onClick={onLoadMore}
        disabled={isLoading}
        className={`bg-gray-200 text-gray-800 px-6 py-3 rounded-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
      >
        {isLoading ? 'Cargando...' : 'Mostrar más órdenes'}
      </button>
    </div>
  );
};

export default LoadMoreButton;