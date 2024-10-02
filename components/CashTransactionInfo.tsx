import React from 'react';
import Link from 'next/link';

interface CashTransactionInfoProps {
  orderIds: string[];
  totalValue: number;
}

const CashTransactionInfo: React.FC<CashTransactionInfoProps> = ({ orderIds, totalValue }) => {
  const orderMessage = orderIds.length > 1
    ? `Se generaron ${orderIds.length} pedidos con números ${orderIds.join(' - ')} respectivamente.`
    : `Se generó el pedido ${orderIds[0]}.`;

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h2 className="text-xl font-semibold mb-3">Información del pedido</h2>
      <p className="mb-4">{orderMessage}</p>
      <p className="mb-4 font-semibold">El valor a pagar contraentrega es de ${totalValue.toFixed(0)}</p>
      <p className="mb-2">Para ver tus pedidos:</p>
      <Link href="/my-orders" className="inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
        Ir a mis pedidos
      </Link>
    </div>
  );
};

export default CashTransactionInfo;