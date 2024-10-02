
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface SeeMoreProps {
  viewAllLink: string;
  buttonText?: string;
}

const SeeMore: React.FC<SeeMoreProps> = ({ viewAllLink, buttonText = 'Ver todos' }) => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push(viewAllLink);
  };

  return (
    <button 
      onClick={handleViewAll}
      className="text-orange-500 hover:text-orange-600 flex items-center text-sm"
    >
      {buttonText}
      <MdOutlineKeyboardArrowRight className="ml-2" />
    </button>
  );
};

export default SeeMore;