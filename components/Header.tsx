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
//import HighlightCategoriesHeader from '@/components/HightlightCategoriesHeader';
import { Category, HighlightCategory } from '@/lib/dataLayer';
import ModalSignIn from '@/components/ModalSignin';
import ModalCustomerZone from '@/components/auth/ModalCustomerZone';
import { useStore } from '@/stores/cartStore';
import { useCurrentUser, useIsAuthenticated } from '@/lib/clientAuthHelper';
import HeaderSkeleton from './skeletons/SkeletonHeader';
//import ColFlag from '@/components/ColFlag';
import { formatCurrency } from '@/lib/Helpers';


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
        subtotalsValue,
        isCartSidebarOpen,
        openCartSidebar,
        closeCartSidebar,
        isLoginModalOpen,
        openLoginModal,    // Agregamos esta línea
        closeLoginModal,
    } = useStore((state) => ({
        isLoading: state.isLoading,
        openLocationModal: state.openLocationModal,
        checkAndShowLocationModal: state.checkAndShowLocationModal,
        shippingAddress: state.shippingAddress,
        totalItems: state.totalItems,
        subtotalsValue: state.subtotalsValue,
        isCartSidebarOpen: state.isCartSidebarOpen,
        openCartSidebar: state.openCartSidebar,
        closeCartSidebar: state.closeCartSidebar,
        isLoginModalOpen: state.isLoginModalOpen,
        openLoginModal: state.openLoginModal,    // Agregamos esta línea
        closeLoginModal: state.closeLoginModal,
    }));
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
    const locationButtonRef = useRef<HTMLButtonElement>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    // const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

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
    /* useEffect(() => {
        checkAndShowLocationModal();
    }, [checkAndShowLocationModal]);
 */
    const handleCustomerZoneClick = () => {
        setIsCustomerZoneOpen(!isCustomerZoneOpen);
    };

    const handleCartClick = () => {
        if (totalItems > 0) {
            openCartSidebar();
        }
    };

    if (isLoading) {
        return <HeaderSkeleton />;
    }
    return (
        <header className="w-full">
            {/* primera fila donde esta la bandera, ubicacion e inicio de sesion */}
            <div className="bg-[#FF8B39] h-10 flex items-center justify-between px-4 text-white">
                <div className="flex items-center">
                    {/* <ColFlag /> */}
                    <span className=" text-xl leading-5 mr-2">🇨🇴</span>
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
                    {isAuthenticated && user ? (
                        <button
                            className="flex items-center"
                            onClick={handleCustomerZoneClick}
                            ref={customerZoneButtonRef}
                        >
                            Hola, {user?.name}
                            <MdKeyboardArrowDown className="ml-1" />
                        </button>
                    ) : (


                        <button className="flex items-center" onClick={openLoginModal}>
                            <FaUser className="mr-1" />
                            Regístrate o Inicia sesión
                        </button>

                    )}

                </div>
            </div>
            {/* logo, buscador, cart y articulos recientes desktop size */}
            <div className="bg-black h-[80px] sm:h-[90px] md:h-[100px] flex items-center justify-between px-4 transition-all duration-300">
                <div className="flex items-center space-x-4">
                    <Logo />
                    <div className=' flex px-4 items-center justify-between space-x-4' onClick={() => setIsCategorySidebarOpen(true)}>
                        <h1 className=' text-xl md:text-2xl font-bold text-white cursor-pointer'>Menú</h1>
                        <FaBars className="text-white mr-4 text-xl sm:text-2xl  cursor-pointer" />
                    </div>
                </div>

                <SearchBox />

                <div className="flex items-center text-white">
                    <FaSearch onClick={() => setIsSearchModalOpen(true)} className="mr-4 text-xl sm:text-2xl md:hidden lg:hidden cursor-pointer" />
                    <Link href={`/recently-viewed-products`}><FaHistory className="mr-4 text-xl sm:text-2xl hidden lg:block" /></Link>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center">
                        <div
                            className={`relative mb-1 sm:mb-0 mr-2 sm:mr-4 ${totalItems > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                            onClick={handleCartClick}
                        >
                            <FaShoppingCart className="text-xl sm:text-2xl" />
                            <span className="absolute -top-2 -right-2 bg-[#FF8B39] rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        </div>
                        <span className="text-sm sm:text-base">{formatCurrency(Number(subtotalsValue.toFixed(0)))}</span>
                    </div>
                </div>
            </div>

            <CategorySidebar
                isOpen={isCategorySidebarOpen}
                onClose={() => setIsCategorySidebarOpen(false)}
                categories={categories}
                onCategoryClick={handleCategoryClick}
            />
            <CartSidebar
                isOpen={isCartSidebarOpen}
                onClose={closeCartSidebar}
            />
            <LocationPopover anchorEl={locationButtonRef.current} />

            <ModalSearchMini
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onProductClick={handleProductClick}
            />
            <ModalSignIn isOpen={isLoginModalOpen} onClose={closeLoginModal} />
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