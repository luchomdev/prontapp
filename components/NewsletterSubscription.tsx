"use client"
import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const NewsletterSubscription: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const isValidEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(email) || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    first_name: "",
                    last_name: ""
                }),
            });

            if (!response.ok) {
                throw new Error('Subscription failed');
            }

            const data = await response.json();
            setMessage('Gracias por el registro a nuestro boletín!');
            setEmail('');

            setTimeout(() => {
                setMessage('');
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            setMessage('Hubo un error. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-orange-500 flex flex-col h-auto sm:h-auto py-4 px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                    <FaEnvelope className="text-white text-2xl mr-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <p className="text-white font-semibold text-lg mr-2">Suscríbete a nuestro boletín</p>
                        <p className="text-white text-sm">… y recibe un cupón del 10% para tu primera compra.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="relative flex flex-shrink-0 w-full sm:w-[450px] lg:w-[650px]">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        className="w-full h-12 pl-4 pr-32 rounded-full border-2 border-white"
                    />
                    <button 
                        type="submit"
                        disabled={!isValidEmail(email) || isSubmitting}
                        className={`absolute right-0 top-0 h-12 px-4 rounded-r-full flex items-center justify-center min-w-[120px] ${
                            isValidEmail(email) && !isSubmitting ? 'bg-black' : 'bg-gray-400'
                        }`}
                    >
                        <span className="text-white text-sm mr-2">
                            {isSubmitting ? 'Enviando...' : 'Suscribirme'}
                        </span>
                        <FaPaperPlane className="text-white" />
                    </button>
                </form>
            </div>
            {message && (
                <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center py-2 transition-opacity duration-300">
                    {message}
                </div>
            )}
        </div>
    );
};

export default NewsletterSubscription;