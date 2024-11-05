import React from 'react';
import { FaEdit } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  is_active: boolean;
  image_type: string | null;
  image_data: string | null;
  level?: number;
  path?: string;
}

interface CategoryCardProps {
  category: Category;
  onModify: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onModify }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-sm">{category.name}</h3>
        <p className="text-sm text-gray-500">Nivel: {category.level}</p>
        <span className={`px-2 py-1 rounded-full text-xs ${category.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {category.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <button
        onClick={onModify}
        className="text-sm text-blue-500 hover:text-blue-700"
        title="Modificar"
      >
        <FaEdit size={20} />
      </button>
    </div>
  );
};

export default CategoryCard;