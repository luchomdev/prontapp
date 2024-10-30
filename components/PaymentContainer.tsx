'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Cash from '@/components/Cash';
import EpaycoWithTc from '@/components/EpaycoWithTc';
import OrderSummary from '@/components/OrderSummary';
import { useStore } from '@/stores/cartStore';
import SkeletonPaymentContainer from '@/components/skeletons/SkeletonPaymentContainer';
import SkeletonLoadingModal from '@/components/skeletons/SkeletonLoadingModal';

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

interface PaymentContainerProps {
    epaycoToken: string;
    user: AuthUser;
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({ epaycoToken, user }) => {
    const [activeMethod, setActiveMethod] = useState<'cash' | 'epayco' | null>(null);
    const [isCreatingTmpOrder, setIsCreatingTmpOrder] = useState(false);
    const {
        customerInfo,
        isLoading,
        shippingAddress,
        setCustomerInfo,
        cart,
        shippingQuote,
        subtotalsValue,
        totalCartValue,
        totalShippingCost,
        payment,
        tmp_order_id,
        setTmpOrderId,
        setPayment
    } = useStore((state) => ({
        customerInfo: state.customerInfo,
        setCustomerInfo: state.setCustomerInfo,
        shippingAddress: state.shippingAddress,
        isLoading: state.isLoading,
        cart: state.cart,
        shippingQuote: state.shippingQuote,
        subtotalsValue: state.subtotalsValue,
        totalCartValue: state.totalCartValue,
        totalShippingCost: state.totalShippingCost,
        payment: state.payment,
        tmp_order_id: state.tmp_order_id,
        setTmpOrderId: state.setTmpOrderId,
        setPayment: state.setPayment
    }));

    useEffect(() => {
        if (user && shippingAddress) {
            const newCustomerInfo = {
                name: `${user.name} ${user.lastName}`,
                email: user.email,
                identification: user.identification || '',
                phone: user.defaultAddress?.phone.replace(/^57/, '') || '',
                address: `${shippingAddress.address || user.defaultAddress?.address || ''} ${shippingAddress.addressComplement}`,
                city_id: shippingAddress.city_id.toString()
            };
            setCustomerInfo(newCustomerInfo);
        }
    }, [user, shippingAddress, setCustomerInfo]);

    const createOrUpdateTmpOrder = useCallback(async () => {
        setIsCreatingTmpOrder(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/tmp-order`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_content: cart,
                    shipping_quote: shippingQuote,
                    shipping_address: shippingAddress,
                    subtotals_value: subtotalsValue,
                    total_cart_value: totalCartValue,
                    total_shipping_cost: totalShippingCost,
                    customer: customerInfo,
                    payment: payment.toString(),
                    auth_user_id: user.id,
                    auth_user_email: user.email,
                    order_tmp_id: tmp_order_id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create or update temporary order');
            }

            const data = await response.json();
            setTmpOrderId(data.id);
        } catch (error) {
            console.error('Error creating or updating temporary order:', error);
            // Aquí puedes manejar el error, por ejemplo mostrando un mensaje al usuario
        } finally {
            setIsCreatingTmpOrder(false);
        }
    }, [cart, shippingQuote, shippingAddress, subtotalsValue, totalCartValue, totalShippingCost, customerInfo, payment, user.id, user.email, tmp_order_id, setTmpOrderId]);

    useEffect(() => {
        if (customerInfo && shippingAddress) {
            createOrUpdateTmpOrder();
        }
    }, [customerInfo, shippingAddress, createOrUpdateTmpOrder]);

    const handleToggle = (method: 'cash' | 'epayco') => {
        setActiveMethod(prevMethod => prevMethod === method ? null : method);
        setPayment(method === 'cash' ? 0 : 1);
    };

    if (isLoading) {
        return <SkeletonPaymentContainer />
    }

    return (
        <>
            {isCreatingTmpOrder && <SkeletonLoadingModal />}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <Cash
                        user={user}
                        isActive={activeMethod === 'cash'}
                        onToggle={() => handleToggle('cash')}
                    />
                    <EpaycoWithTc
                        isActive={activeMethod === 'epayco'}
                        onToggle={() => handleToggle('epayco')}
                        epaycoToken={epaycoToken}
                        user={user}
                    />
                </div>
                <div className="lg:w-1/3">
                    <OrderSummary />
                </div>
            </div>
        </>
    );
};

export default PaymentContainer;