import React from 'react';

const SkeletonLoadingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-end">
        <p className="text-lg mr-3">Espera un momento</p>
        <div className="flex items-end space-x-1">
          {[1, 2, 3].map((dot) => (
            <div 
              key={dot} 
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: `${dot * 0.15}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoadingModal;