"use client"
import React, { useEffect, useRef } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import TransactionInfo from '@/components/TransactionInfo';
import BrandMessage from '@/components/BrandMessage';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/stores/cartStore';

const ConfirmationClientComp: React.FC = () => {
  const resetAllState = useStore(state => state.resetAllState);
  const searchParams = useSearchParams()
  const transaction_info = JSON.parse(searchParams.get('res_transaction') || "")
  console.log("[transaction info]", transaction_info)

  const isApproved = transaction_info?.respuesta === 'Aprobada' && Number(transaction_info?.cod_respuesta) === 1;
  const status = transaction_info?.respuesta === 'Aprobada' ? 'approved' : 'pending';

  const hasResetState = useRef(false);

  useEffect(() => {
    if (!hasResetState.current) {
      resetAllState();
      hasResetState.current = true;
    }
  }, [resetAllState]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-between">
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            {isApproved ? (
              <FaCheckCircle className="text-green-700 text-3xl mr-2" />
            ) : (
              <FaClock className="text-orange-700 text-3xl mr-2" />
            )}
            <h1 className="text-2xl font-bold">
              {isApproved
                ? "Gracias por su compra, su transacción fue aprobada"
                : "Gracias por su compra, la transacción está en revisión"}
            </h1>
          </div>
          <TransactionInfo
            status={status}
            transactionRef={transaction_info?.ref_payco}
            invoiceNumber={transaction_info?.factura}
            amountPaid={transaction_info?.valor}
          />
          <Link href="/panel/orders" className="inline-block mt-6 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
            Ir a Mis pedidos
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:pl-8">
        <BrandMessage />
      </div>
    </div>
  );
};

export default ConfirmationClientComp;