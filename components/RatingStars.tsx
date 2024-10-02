import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface RatingStarsProps {
  rating: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, className = '' }) => {
  return (
    <div className={`flex ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating 
          ? <FaStar key={star} className="text-yellow-400" />
          : <FaRegStar key={star} className="text-gray-300" />
      ))}
    </div>
  );
};

export default RatingStars;