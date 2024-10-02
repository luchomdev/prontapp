"use client"
import React from 'react';
import Logo from "@/app/(admin)/components/Logo"
const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm p-4 text-center">
      <div className="text-slate-600 text-xs flex items-center justify-center">
        <Logo textSize="sm" /> {` - `} <span>copyright 2024</span>
      </div>
    </footer>
  );
};

export default Footer;