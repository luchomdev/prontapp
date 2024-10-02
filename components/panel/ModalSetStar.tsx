import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Toaster from '@/components/Toaster';

interface ModalSetStarProps {
  productId: string;
  orderId: string;
  onClose: () => void;
}

const ModalSetStar: React.FC<ModalSetStarProps> = ({ productId, orderId, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          orderId,
          rating: rating.toString(),
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      setToastMessage('Calificación enviada con éxito');
      setToastType('success');
      setTimeout(onClose, 2000); // Close modal after showing success message
    } catch (error) {
      console.error('Error submitting rating:', error);
      setToastMessage('Error al enviar la calificación');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-2">
        <h3 className="text-lg font-semibold mb-4">Calificar Producto</h3>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          placeholder="Escribe tu comentario aquí..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:bg-orange-300"
          >
            {isSubmitting ? 'Enviando...' : 'Calificar'}
          </button>
        </div>
      </div>
      {toastMessage && (
        <Toaster
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ModalSetStar;