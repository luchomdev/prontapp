import React from 'react';
import { formatCurrency } from '@/lib/Helpers';

interface TransactionInfoProps {
  status: 'approved' | 'pending';
  transactionRef: string;
  invoiceNumber: string;
  amountPaid: number;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  status,
  transactionRef,
  invoiceNumber,
  amountPaid
}) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h2 className="text-xl font-semibold mb-3">Información de la transacción</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Referencia:</p>
          <p>{transactionRef}</p>
        </div>
        <div>
          <p className="font-medium">Factura:</p>
          <p>{invoiceNumber}</p>
        </div>
        <div>
          <p className="font-medium">Valor Pagado:</p>
          <p>{formatCurrency(Number(amountPaid))}</p>
        </div>
        <div>
          <p className="font-medium">Estado:</p>
          <p className={status === 'approved' ? 'text-green-700' : 'text-orange-700'}>
            {status === 'approved' ? 'Aprobada' : 'En revisión'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;