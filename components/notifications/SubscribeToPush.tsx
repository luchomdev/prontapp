'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    const binary = Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('');
    return window.btoa(binary);
}

export default function SubscribeToPush() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when scrolled past header (assuming header height is around 200px)
            if (window.pageYOffset > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        console.log('VAPID key presente:', !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
    }, []);

    useEffect(() => {
        const checkSupport = async () => {
            try {
                console.log('Verificando soporte:', {
                    notification: 'Notification' in window,
                    serviceWorker: 'serviceWorker' in navigator,
                    pushManager: 'PushManager' in window
                });
    
                const isNotificationSupported = 'Notification' in window;
                const isServiceWorkerSupported = 'serviceWorker' in navigator;
                const isPushManagerSupported = 'PushManager' in window;
    
                const supported = isNotificationSupported && isServiceWorkerSupported && isPushManagerSupported;
                setIsSupported(supported);
    
                if (supported) {
                    const registration = await navigator.serviceWorker.ready;
                    console.log('Service Worker registrado:', registration);
    
                    const permission = Notification.permission;
                    console.log('Estado actual del permiso:', permission);
    
                    const hasPromptBeenShown = localStorage.getItem('pushPromptShown');
                    console.log('Prompt mostrado anteriormente:', hasPromptBeenShown);
    
                    if (!hasPromptBeenShown && permission !== 'granted') {
                        const timer = setTimeout(() => {
                            setShowPrompt(true);
                        }, 5000);
                        return () => clearTimeout(timer);
                    }
    
                    const subscription = await registration.pushManager.getSubscription();
                    console.log('Suscripción existente:', subscription);
                    
                    setIsSubscribed(!!subscription);
                }
            } catch (err) {
                console.error('Error en checkSupport:', err);
            } finally {
                setIsLoading(false);
            }
        };
    
        checkSupport();
    }, []);

   async function checkSubscription() {
        try {
            if (!isSupported) {
                setError('Tu navegador no soporta notificaciones push');
                setIsLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            setIsSubscribed(!!subscription);
            setIsLoading(false);
        } catch (err) {
            console.error('Error al verificar suscripción:', err);
            setError('Error al verificar el estado de las notificaciones');
            setIsLoading(false);
        }
    }

    async function handleSubscription() {
        try {
            setIsLoading(true);
            setError(null);

            if (!isSupported) {
                throw new Error('Tu navegador no soporta notificaciones push');
            }

            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Necesitamos tu permiso para enviar notificaciones');
                }
            }

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                    )
                });
            }

            const p256dhKey = subscription.getKey('p256dh');
            const authKey = subscription.getKey('auth');

            if (!p256dhKey || !authKey) {
                throw new Error('No se pudieron obtener las claves de suscripción');
            }

            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: arrayBufferToBase64(p256dhKey),
                        auth: arrayBufferToBase64(authKey)
                    },
                    userAgent: navigator.userAgent
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la suscripción');
            }

            setIsSubscribed(true);
            setShowPrompt(false);
            localStorage.setItem('pushPromptShown', 'true');
            router.refresh();
        } catch (err: any) {
            console.error('Error al suscribirse:', err);
            setError(err.message || 'Error al activar las notificaciones');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUnsubscribe() {
        try {
            setIsLoading(true);
            setError(null);

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                await fetch('/api/notifications/subscribe', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint
                    })
                });
            }

            setIsSubscribed(false);
            router.refresh();
        } catch (err) {
            console.error('Error al cancelar suscripción:', err);
            setError('Error al desactivar las notificaciones');
        } finally {
            setIsLoading(false);
        }
    }

    function handleDismiss() {
        setShowPrompt(false);
        localStorage.setItem('pushPromptShown', 'true');
    }

    if (isLoading) {
        return <div className="animate-spin h-5 w-5 border-2 border-orange-500 rounded-full border-t-transparent"></div>;
    }

    if (error) {
        return (
            <button
                onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    checkSubscription();
                }}
                className="text-sm text-orange-600 hover:text-orange-700"
            >
                Reintentar
            </button>
        );
    }

    if (!isSupported) {
        return null;
    }

    // Prompt flotante (aparece en la parte superior)
    if (showPrompt && !isSubscribed) {
        return (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Mantente informado
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Recibe notificaciones sobre ofertas especiales y el estado de tus pedidos.
                        </p>
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={handleSubscription}
                                disabled={isLoading}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                <FiBell className="h-4 w-4 mr-2" />
                                Activar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Más tarde
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Botón de toggle simplificado (solo icono, aparece solo cuando se hace scroll)
    return (
        <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscription}
            disabled={isLoading}
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 rounded-full shadow-lg p-3 
                ${isSubscribed 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ display: isVisible ? 'block' : 'none' }}
            aria-label={isSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
            title={isSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
        >
            {isSubscribed ? (
                <FiBellOff className="h-6 w-6" />
            ) : (
                <FiBell className="h-6 w-6" />
            )}
        </button>
    );
}