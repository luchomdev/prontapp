import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/auth/LogoutButton';
import { useStore } from '@/stores/cartStore';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  level: number;
}

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoryClick: (category: Category) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ isOpen, onClose, categories, onCategoryClick }) => {
  const [currentLevel, setCurrentLevel] = useState<CategoryWithChildren[]>([]);
  const [history, setHistory] = useState<CategoryWithChildren[][]>([]);
  const { isAuthenticated, user } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    const buildCategoryTree = (categories: Category[]): CategoryWithChildren[] => {
      const categoryMap = new Map<string, CategoryWithChildren>();
      categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
      });

      const rootCategories: CategoryWithChildren[] = [];
      categoryMap.forEach(category => {
        if (category.parent_id === null) {
          rootCategories.push(category);
        } else {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(category);
          }
        }
      });

      return rootCategories;
    };

    const rootCategories = buildCategoryTree(categories);
    setCurrentLevel(rootCategories);
  }, [categories]);

  useEffect(() => {
    if (wasAuthenticated && !isAuthenticated && isOpen) {
      onClose();
    }
    setWasAuthenticated(isAuthenticated);
  }, [isAuthenticated, isOpen, onClose, wasAuthenticated]);

  const navigateToSubcategory = (category: CategoryWithChildren) => {
    if (category.children && category.children.length > 0) {
      setHistory([...history, currentLevel]);
      setCurrentLevel(category.children);
    } else if (category.level === 2 || category.level === 3) {
      onCategoryClick(category);
    }
  };

  const navigateBack = () => {
    if (history.length > 0) {
      const previousLevel = history[history.length - 1];
      setCurrentLevel(previousLevel);
      setHistory(history.slice(0, -1));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 md:w-80 lg:w-96 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <Logo />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        {isAuthenticated && user && (
          <div className="mt-2 flex flex-col items-center justify-center space-x-3">
            <p className="text-sm font-medium text-gray-700">Hola, {user.name}</p>
            <div className="mt-2">
              <LogoutButton onLogoutComplete={onClose} />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-b">
        <p className="text-lg font-semibold">Categorías</p>
      </div>
      <div className="flex-grow overflow-y-auto">
        {history.length > 0 && (
          <button onClick={navigateBack} className="p-4 text-left w-full hover:bg-gray-100 flex items-center">
            <FaChevronLeft className="mr-2" /> Volver
          </button>
        )}
        {currentLevel.map((category) => (
          <button
            key={category.id}
            onClick={() => navigateToSubcategory(category)}
            className="p-4 text-left w-full hover:bg-gray-100 flex justify-between items-center"
          >
            <span>{category.name}</span>
            {category.children && category.children.length > 0 && <FaChevronRight />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;