import React from 'react';
import RatingStars from '@/components/RatingStars';
import { formatCurrency } from '@/lib/Helpers';
import { FaMoneyBillWave } from 'react-icons/fa';

interface ProductInfoProps {
  name: string;
  rating: string;
  ratingCount: string;
  amount: string;
  price: string;
  price_by_unit: string;
  price_fake_discount: string | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  rating,
  ratingCount,
  amount,
  price,
  price_by_unit,
  price_fake_discount
}) => {
  const currentPrice = parseFloat(price);
  const originalPrice = parseFloat(price_by_unit);
  const discountPrice = price_fake_discount ? parseFloat(price_fake_discount) : null;

  const shouldShowDiscount = price_fake_discount !== null;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <div className="flex items-center mb-2">
        <RatingStars rating={parseFloat(rating)} />
        <span className="ml-2 text-sm text-gray-600">({ratingCount} valoraciones)</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">Disponibles: {amount}</p>
      <div className="flex items-center">
        {shouldShowDiscount ? (
          <>
            <p className="text-sm text-red-500 line-through mr-2">
              {formatCurrency(discountPrice!)}

            </p>
            <p className="text-2xl font-bold text-slate-600">
              {formatCurrency(currentPrice)}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-slate-600">
            {formatCurrency(currentPrice)}
          </p>
        )}
      </div>
      <div className="flex items-center mt-2">
        <FaMoneyBillWave className="text-green-700 mr-2" />
        <span className="text-green-700 font-medium">Pago Contraentrega</span>
      </div>
    </div>
  );
};

export default ProductInfo;