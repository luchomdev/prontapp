"use client"
import React from 'react';
import { FaTachometerAlt, FaList, FaBox, FaUsers, FaImages, FaBell } from 'react-icons/fa';
import { BiPurchaseTagAlt } from "react-icons/bi";
import Link from 'next/link';
import { useStore } from '@/stores/cartStore';

const menuItems = [
  { icon: FaTachometerAlt, text: 'Tablero Inicial', href: '/console/dashboard' },
  { icon: FaList, text: 'Categorías', href: '/console/categories' },
  { icon: FaBox, text: 'Productos', href: '/console/products' },
  { icon: BiPurchaseTagAlt, text: 'Órdenes', href: '/console/orders' },
  { icon: FaUsers, text: 'Usuarios admin / Clientes', href: '/console/customers' },
  { icon: FaImages, text: 'Banners', href: '/console/banners' },
  { icon: FaBell, text: 'Notificaciones Push Web', href: '/console/notifications' },
];

const Sidebar: React.FC = () => {
  const isCollapsed = useStore((state) => state.isSidebarCollapsed);

  return (
    <aside className={`bg-slate-50 h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
      <nav className="p-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link href={item.href} className="flex items-center text-slate-600 hover:text-slate-800">
                <item.icon size={16} className={isCollapsed ? '' : 'mr-2'} />
                {!isCollapsed && <span className="text-xs">{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;