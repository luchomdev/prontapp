"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaCreditCard, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PaySecureText from '@/components/SecurePaymentText';
import { useStore } from '@/stores/cartStore';
import SkeletonLoadingModal from '@/components/skeletons/SkeletonLoadingModal';
import Toaster from '@/components/Toaster';
import { getShippingQuote } from '@/app/actions/shipping';
import { createOrUpdateTmpOrderAct, getSavedCards, processEpaycoPayment } from '@/app/actions/payment';

interface AuthUser {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    identification: string | null;
    defaultAddress: {
        cityId: number;
        address: string;
        phone: string;
    } | null;
}

interface EpaycoWithTcProps {
    isActive: boolean;
    onToggle: () => void;
    epaycoToken: string;
    user: AuthUser
}

interface SavedCard {
    id: string;
    cardtokenid: string;
    customer_id: string;
    brand: string;
    lastfour: string;
    expiryyear: string;
    expirymonth: string;
}

const EpaycoWithTc: React.FC<EpaycoWithTcProps> = ({ isActive, onToggle, epaycoToken, user }) => {
    const router = useRouter();
    const [showNewCardForm, setShowNewCardForm] = useState(false);
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [cardNumber, setCardNumber] = useState('');
    const [cardExpYear, setCardExpYear] = useState('');
    const [cardExpMonth, setCardExpMonth] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [dues, setDues] = useState('1');

    const hasRunEffect = useRef(false);

    const {
        setPayment,
        shippingAddress,
        cart,
        setShippingQuote,
        setTotalShippingCost,
        subtotalsValue,
        tmp_order_id,
        setTmpOrderId,
        customerInfo,
        totalCartValue,
        shippingQuote
    } = useStore(state => ({
        setPayment: state.setPayment,
        shippingAddress: state.shippingAddress,
        cart: state.cart,
        setShippingQuote: state.setShippingQuote,
        setTotalShippingCost: state.setTotalShippingCost,
        subtotalsValue: state.subtotalsValue,
        tmp_order_id: state.tmp_order_id,
        setTmpOrderId: state.setTmpOrderId,
        customerInfo: state.customerInfo,
        totalCartValue: state.totalCartValue,
        shippingQuote: state.shippingQuote
    }));

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    const fetchShippingQuote = useCallback(async () => {
        if (!shippingAddress) return;

        setIsLoadingQuote(true);
        try {
            const stock_ids = Object.keys(cart).map(Number);
            const data = await getShippingQuote(stock_ids, shippingAddress.city_id, 1);

            if (data?.status === 'success') {
                setShippingQuote(data.quotations);
                const totalShipping = data.quotations.reduce((sum: number, q) => sum + q.shipping_value, 0);
                setTotalShippingCost(totalShipping);
            }
        } catch (error) {
            console.error('Error fetching shipping quote:', error);
            setError('Error al calcular el costo de envío');
        } finally {
            setIsLoadingQuote(false);
        }
    }, [shippingAddress, cart, setShippingQuote, setTotalShippingCost]);

    const createOrUpdateTmpOrder = useCallback(async () => {
        setIsLoadingOrder(true);
        try {
            const currentState = useStore.getState();
            const data = await createOrUpdateTmpOrderAct({
                cart_content: currentState.cart,
                shipping_quote: currentState.shippingQuote,
                shipping_address: currentState.shippingAddress,
                subtotals_value: currentState.subtotalsValue,
                total_cart_value: currentState.totalCartValue,
                total_shipping_cost: currentState.totalShippingCost,
                customer: currentState.customerInfo,
                payment: "1", // Pago con tarjeta
                auth_user_id: user.id,
                auth_user_email: user.email,
                order_tmp_id: currentState.tmp_order_id
            });

            if (data) {
                setTmpOrderId(data.id);
            }
        } catch (error) {
            console.error('Error creating or updating temporary order:', error);
            setError('Error al actualizar la orden temporal');
        } finally {
            setIsLoadingOrder(false);
        }
    }, [user, setTmpOrderId]);

    const loadSavedCards = useCallback(async () => {
        try {
            const data = await getSavedCards(user.id, user.email);
            if (data) {
                setSavedCards(data);
                if (data.length === 0) setShowNewCardForm(true);
            }
        } catch (error) {
            console.error('Error loading saved cards:', error);
            setError('Error al cargar las tarjetas guardadas');
        }
    }, [user.id, user.email]);

    useEffect(() => {
        if (isActive && !hasRunEffect.current) {
            hasRunEffect.current = true;
            fetchShippingQuote();
        }
    }, [isActive, fetchShippingQuote]);

    useEffect(() => {
        if (isActive && shippingQuote.length > 0) {
            createOrUpdateTmpOrder().then(() => {
                loadSavedCards();
            });
        }
    }, [isActive, shippingQuote, createOrUpdateTmpOrder, loadSavedCards]);

    const handleToggle = () => {
        onToggle();
        if (!isActive) {
            setPayment(1);
            hasRunEffect.current = false; // Reset the flag when toggling
        }
    };

    const handleCardSelection = (cardId: string) => {
        setSelectedCardId(cardId === selectedCardId ? null : cardId);
        setShowNewCardForm(false);
    };

    const toggleNewCardForm = () => {
        setShowNewCardForm(!showNewCardForm);
        setSelectedCardId(null);
    };

    const isFormValid = () => {
        if (selectedCardId) return true;
        return cardNumber && cardExpYear && cardExpMonth && cardCvc;
    };

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const selectedCard = savedCards.find(card => card.id === selectedCardId);
            const paymentData = {
                tokenEpayco: epaycoToken,
                value: totalCartValue.toString(),
                docType: "CC",
                docNumber: customerInfo?.identification,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                cellPhone: customerInfo?.phone,
                phone: customerInfo?.phone,
                cardTokenId: selectedCard ? selectedCard.cardtokenid : '',
                cardNumber: selectedCard ? '' : cardNumber,
                cardExpYear: selectedCard ? '' : cardExpYear,
                cardExpMonth: selectedCard ? '' : cardExpMonth,
                cardCvc: selectedCard ? '' : cardCvc,
                dues: dues,
                testMode: process.env.NEXT_PUBLIC_EPAYCO_TEST === 'true',
                extra1: tmp_order_id
            };

            const result = await processEpaycoPayment(paymentData);

            if (result?.data.transaction.success &&
                (Number(result.data.transaction.data.cod_respuesta) === 1 ||
                    Number(result.data.transaction.data.cod_respuesta) === 3)) {
                router.replace(`/confirmation?res_transaction=${encodeURIComponent(JSON.stringify(result.data.transaction.data))}`);
            } else {
                setError('El pago no pudo ser procesado. Por favor, intente nuevamente.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Error al procesar el pago');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6 border rounded-lg p-4">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <FaCreditCard className="text-2xl mr-2 text-orange-500" />
                    <h2 className="text-xl font-semibold">Tarjeta de Crédito</h2>
                </div>
                <PaySecureText />
            </div>
            {isActive && (
                <div className="mt-4">
                    {savedCards.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Tarjetas guardadas:</h3>
                            {savedCards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center transition-colors duration-200 ${selectedCardId === card.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleCardSelection(card.id)}
                                >
                                    <span>{card.brand} **** **** **** {card.lastfour}</span>
                                    <span>Exp: {card.expirymonth}/{card.expiryyear}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div
                        className={`flex items-center justify-between cursor-pointer mb-2 p-3 border rounded-lg hover:bg-gray-100 transition-colors duration-200 ${showNewCardForm ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                            }`}
                        onClick={toggleNewCardForm}
                    >
                        <span className="flex items-center">
                            <FaPlus className="mr-2" />
                            Agregar nueva tarjeta
                        </span>
                        {showNewCardForm ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showNewCardForm && (
                        <form className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
                            <div>
                                <label htmlFor="cardNumber" className="block mb-1">Número de tarjeta</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="1234 5678 9012 3456"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="expiryYear" className="block mb-1">Año de vencimiento</label>
                                    <select
                                        id="expiryYear"
                                        value={cardExpYear}
                                        onChange={(e) => setCardExpYear(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="expiryMonth" className="block mb-1">Mes de vencimiento</label>
                                    <select
                                        id="expiryMonth"
                                        value={cardExpMonth}
                                        onChange={(e) => setCardExpMonth(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        {months.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block mb-1">Código de Seguridad (CVC)</label>
                                <input
                                    type="text"
                                    id="cvc"
                                    value={cardCvc}
                                    onChange={(e) => setCardCvc(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="123"
                                    maxLength={3}
                                />
                            </div>
                            <div>
                                <label htmlFor="installments" className="block mb-1">Número de Cuotas</label>
                                <select
                                    id="installments"
                                    value={dues}
                                    onChange={(e) => setDues(e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num.toString()}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    )}
                    <button
                        onClick={handlePayment}
                        disabled={!isFormValid() || isLoading || isLoadingQuote || isLoadingOrder}
                        className="mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300 w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Pagar
                    </button>
                </div>
            )}
            {(isLoading || isLoadingQuote || isLoadingOrder) && <SkeletonLoadingModal />}
            {error && (
                <Toaster
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};

export default EpaycoWithTc;