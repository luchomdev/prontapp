import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchCategoriesProps {
  onSearch: (term: string) => void;
  onReset: () => void;
  searchTerm: string;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({ onSearch, onReset, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleReset = () => {
    setLocalSearchTerm('');
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Buscar categorías..."
          className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 border rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaSearch />
        </button>
        {localSearchTerm && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchCategories;