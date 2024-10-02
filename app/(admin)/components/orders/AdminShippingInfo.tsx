import React from 'react';

interface ShippingHistoryItemProps {
  date: string;
  description: string;
}

const ShippingHistoryItem: React.FC<ShippingHistoryItemProps> = ({ date, description }) => (
  <div className="flex items-start mb-4">
    <div className="bg-orange-500 rounded-full w-4 h-4 mt-1 mr-4"></div>
    <div>
      <p className="font-semibold">{new Date(date).toLocaleDateString('es-ES')}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

interface AdminShippingInfoProps {
  guide_state_description: string | null;
  guide_histories: Array<{ created_at: string; description: string }> | null;
}

const AdminShippingInfo: React.FC<AdminShippingInfoProps> = ({ guide_state_description, guide_histories }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-md font-semibold mb-4">Información de Envío</h2>
      <p className="mb-4"><strong>Estado del Envío:</strong> {guide_state_description || 'No disponible'}</p>
      {guide_histories && guide_histories.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Historial de Envío:</h3>
          <div className="border-l-2 border-orange-500 pl-4 ml-2">
            {guide_histories.map((history, index) => (
              <ShippingHistoryItem
                key={index}
                date={history.created_at}
                description={history.description}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminShippingInfo;