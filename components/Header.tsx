"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaMapMarkerAlt, FaUser, FaSearch, FaHistory, FaShoppingCart, FaBars } from 'react-icons/fa';
import { MdKeyboardArrowDown } from "react-icons/md";
import Logo from '@/components/Logo';
import CategorySidebar from '@/components/CategorySidebar';
import CartSidebar from '@/components/CartSidebar';
import LocationPopover from '@/components/LocationPopover';
import ModalSearchMini from '@/components/ModalSearchMini';
import SearchBox from '@/components/SearchBox';
import HighlightCategoriesHeader from '@/components/HightlightCategoriesHeader';
import { Category, HighlightCategory } from '@/lib/dataLayer';
import ModalSignIn from '@/components/ModalSignin';
import ModalCustomerZone from '@/components/auth/ModalCustomerZone';
import { useStore } from '@/stores/cartStore';
import { useCurrentUser, useIsAuthenticated } from '@/lib/clientAuthHelper';
import HeaderSkeleton from './skeletons/SkeletonHeader';
import ColFlag from '@/components/ColFlag';


interface HeaderProps {
    categories: Category[];
    highlightCategories: HighlightCategory[];
}

const Header: React.FC<HeaderProps> = ({ categories, highlightCategories }) => {
    const router = useRouter()
    const isAuthenticated = useIsAuthenticated()
    const user = useCurrentUser()
    const {
        isLoading,
        openLocationModal,
        checkAndShowLocationModal,
        shippingAddress,
        totalItems,
        subtotalsValue
    } = useStore((state) => ({
        isLoading: state.isLoading,
        openLocationModal: state.openLocationModal,
        checkAndShowLocationModal: state.checkAndShowLocationModal,
        shippingAddress: state.shippingAddress,
        totalItems: state.totalItems,
        subtotalsValue: state.subtotalsValue
    }));
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
    const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
    const locationButtonRef = useRef<HTMLButtonElement>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    const [isCustomerZoneOpen, setIsCustomerZoneOpen] = useState(false);
    const customerZoneButtonRef = useRef<HTMLButtonElement>(null);

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId.toString()}`)
        setIsSearchModalOpen(false);
    };

    const handleCategoryClick = (category: Category) => {
        console.log("Selected Category", category);
        router.push(`/products/${category.id}/${category.slug}`);
        setIsCategorySidebarOpen(false);
    };
    useEffect(() => {
        checkAndShowLocationModal();
    }, [checkAndShowLocationModal]);

    const handleCustomerZoneClick = () => {
        setIsCustomerZoneOpen(!isCustomerZoneOpen);
    };

    if (isLoading) {
        return <HeaderSkeleton />;
    }
    return (
        <header className="w-full">
            <div className="bg-[#FF8B39] h-10 flex items-center justify-between px-4 text-white">
                <div className="flex items-center">
                    <ColFlag />
                    <span className="text-xs font-bold">COLOMBIA</span>
                </div>
                <div className="flex items-center">
                    <button
                        className="flex items-center mr-4"
                        ref={locationButtonRef}
                        onClick={openLocationModal}
                    >
                        <FaMapMarkerAlt className="mr-1" />
                        <span className="text-sm sm:text-base">
                            {shippingAddress ? "Cambiar ubicación" : "Establecer ubicación"}
                        </span>
                    </button>
                    {isAuthenticated ? (
                        <button 
                        className="flex items-center" 
                        onClick={handleCustomerZoneClick}
                        ref={customerZoneButtonRef}
                        >
                            Hola, {user?.name}
                            <MdKeyboardArrowDown className="ml-1" />
                        </button>
                    ) : (
                        <button className="flex items-center" onClick={() => setIsSignInModalOpen(true)}>
                            <FaUser className="mr-1" />
                            Regístrate o Inicia sesión
                        </button>
                    )}

                </div>
            </div>

            <div className="bg-black h-[80px] sm:h-[90px] md:h-[100px] flex items-center justify-between px-4 transition-all duration-300">
                <div className="flex items-center">
                    <FaBars className="text-white mr-4 text-xl sm:text-2xl lg:hidden cursor-pointer" onClick={() => setIsCategorySidebarOpen(true)} />
                    <Logo />
                </div>

                <SearchBox />

                <div className="flex items-center text-white">
                    <FaSearch onClick={() => setIsSearchModalOpen(true)} className="mr-4 text-xl sm:text-2xl md:hidden lg:hidden cursor-pointer" />
                    <Link href={`/recently-viewed-products`}><FaHistory className="mr-4 text-xl sm:text-2xl hidden lg:block" /></Link>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center">
                        <div className="relative mb-1 sm:mb-0 mr-2 sm:mr-4 cursor-pointer" onClick={() => setIsCartSidebarOpen(true)}>
                            <FaShoppingCart className="text-xl sm:text-2xl" />
                            <span className="absolute -top-2 -right-2 bg-[#FF8B39] rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        </div>
                        <span className="text-sm sm:text-base">${subtotalsValue.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 h-12 items-center px-4 hidden lg:flex">
                <button
                    className="flex items-center mr-4 cursor-pointer"
                    onClick={() => setIsCategorySidebarOpen(true)}
                >
                    <FaBars className="text-[#FF8B39] border border-[#FF8B39] p-1 mr-2" />
                    <span className="text-[#FF8B39]">Categorías</span>
                </button>
                <HighlightCategoriesHeader categories={highlightCategories} />
            </div>

            <CategorySidebar
                isOpen={isCategorySidebarOpen}
                onClose={() => setIsCategorySidebarOpen(false)}
                categories={categories}
                onCategoryClick={handleCategoryClick}
            />
            <CartSidebar
                isOpen={isCartSidebarOpen}
                onClose={() => setIsCartSidebarOpen(false)}
            />
            <LocationPopover
                anchorEl={locationButtonRef.current}
            />
            <ModalSearchMini
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onProductClick={handleProductClick}
            />
            <ModalSignIn isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
            {isCustomerZoneOpen && (
                <ModalCustomerZone 
                    anchorEl={customerZoneButtonRef.current} 
                    onClose={() => setIsCustomerZoneOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;