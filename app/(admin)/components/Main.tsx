"use client"
import React from 'react';

interface MainProps {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
}

const Main: React.FC<MainProps> = ({ children, isSidebarCollapsed }) => {
  return (
    <main className={`flex-1 p-6 bg-white transition-all duration-300 border-l border-slate-200`}>
      {children}
    </main>
  );
};

export default Main;