'use client';

import React from 'react';
import Header from "@/app/(admin)/components/Header";
import Footer from "@/app/(admin)/components/Footer";
import Sidebar from "@/app/(admin)/components/Sidebar";
import Main from "@/app/(admin)/components/Main";
import { useStore } from '@/stores/cartStore';
import { useHydration } from '@/hooks/useHydration';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const hydrated = useHydration();
  const {isSidebarCollapsed, isLoading} = useStore((state) => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    isLoading: state.isLoading
  }));
  if (!hydrated || isLoading) {
    return <div>Espere ...</div>;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Main isSidebarCollapsed={isSidebarCollapsed}>{children}</Main>
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;