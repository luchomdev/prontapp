import React from 'react';
import RatingStars from '@/components/RatingStars';
import { ProductRating } from '@/lib/dataLayer';

interface ReviewListProps {
    reviews: ProductRating[];
  }



const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Comentarios de clientes</h2>
      {reviews.length === 0 ? (
        <p>No hay comentarios aún para este producto.</p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">{review.name}</span>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm mb-1">{review.comment}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;