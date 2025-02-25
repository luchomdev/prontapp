'use client';

import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { IoWifiOutline } from "react-icons/io5";
import { FiHome, FiRefreshCw } from "react-icons/fi";
import { useEffect } from "react";

export default function OfflinePage() {
    useEffect(() => {
        // Intentar cargar el contenido cacheado
        async function loadCachedContent() {
            try {
                const cache = await caches.open('prontapp-v1');
                const response = await cache.match('/products/cb587118-4629-4ba6-a390-c613a04aac9b/product-hot-sales');
                
                if (response) {
                    const data = await response.json();
                    // Aquí puedes mostrar el contenido cacheado
                    const container = document.getElementById('cached-content');
                    if (container && data) {
                        container.innerHTML = `
                            <div class="bg-white shadow rounded-lg p-4 mt-4">
                                <h3 class="text-lg font-medium text-gray-900">Último producto visto</h3>
                                <div class="mt-2">
                                    <h4 class="text-md font-medium">${data.name}</h4>
                                    <p class="text-sm text-gray-600">${data.description}</p>
                                    <p class="text-orange-600 font-medium mt-1">$${data.price}</p>
                                </div>
                            </div>
                        `;
                    }
                }
            } catch (error) {
                console.error('Error al cargar contenido cacheado:', error);
            }
        }

        loadCachedContent();
    }, []);

    return (
        <>
            <PageTitle title="Sin Conexión" />
            <Container>
                <div className="flex items-center justify-center sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 mx-auto text-center">
                        <div className="flex justify-center">
                            <IoWifiOutline className="h-24 w-24 text-orange-600" />
                        </div>
                        
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Sin conexión a Internet
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                No pudimos conectarnos a Internet. Algunas funciones pueden no estar disponibles.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">¿Qué puedes hacer?</h3>
                                <ul className="mt-3 text-sm text-gray-600 text-left space-y-2">
                                    <li>• Verificar tu conexión a Internet</li>
                                    <li>• Ver productos guardados en caché</li>
                                    <li>• Acceder a tu carrito guardado</li>
                                    <li>• Ver tus pedidos recientes</li>
                                </ul>
                            </div>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <FiRefreshCw className="h-4 w-4 mr-2" />
                                    Reintentar
                                </button>

                                <a
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <FiHome className="h-4 w-4 mr-2" />
                                    Ir al inicio
                                </a>
                            </div>
                        </div>

                        <div id="cached-content" className="mt-8">
                            {/* El contenido cacheado se cargará aquí dinámicamente */}
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                                <p className="text-sm text-orange-700">
                                    Mientras recuperas la conexión, puedes ver el contenido guardado en tu dispositivo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}