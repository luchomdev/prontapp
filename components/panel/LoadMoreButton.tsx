"use client"
import React from 'react';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore }) => {
  return (
    <div className="text-center mt-8">
      <button 
        onClick={onLoadMore}
        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
      >
        Mostrar más órdenes
      </button>
    </div>
  );
};

export default LoadMoreButton;