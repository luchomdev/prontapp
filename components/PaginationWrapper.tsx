'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Pagination from '@/components/Pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  extraParams?: Record<string, string>;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  extraParams = {}
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(extraParams);
    params.set('page', page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default PaginationWrapper;