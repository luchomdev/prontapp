import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface MegaLoadMoreDataProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const MegaLoadMoreData: React.FC<MegaLoadMoreDataProps> = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Cargando...
          </>
        ) : (
          'Cargar más productos'
        )}
      </button>
    </div>
  );
};

export default MegaLoadMoreData;