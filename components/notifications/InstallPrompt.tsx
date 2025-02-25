// components/InstallPrompt.tsx
'use client';

import { useState, useEffect } from 'react';
import { IoShareOutline } from "react-icons/io5";
import { FaRegPlusSquare } from "react-icons/fa";

export default function InstallPrompt() {
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && isSafari && !isStandalone) {
            setShowIOSPrompt(true);
        }
    }, []);

    if (!showIOSPrompt) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-40">
            <div className="flex items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">Instala Prontapp</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Para instalar la app en tu iPhone:
                    </p>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">1. Toca el botón compartir</span>
                            <IoShareOutline className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">2. Selecciona la opción &ldquo;Agregar a Inicio&rdquo;</span>
                            <FaRegPlusSquare className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowIOSPrompt(false)}
                    className="text-gray-400 hover:text-gray-500 p-1"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}