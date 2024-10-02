import React from 'react';
import { FaEdit } from 'react-icons/fa';

interface Config {
  key: string;
  value: string | number;
}

interface ConfigListProps {
  configs: Config[];
  onEdit: (config: Config) => void;
}

const ConfigList: React.FC<ConfigListProps> = ({ configs, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Nombre configuración</th>
            <th className="py-2 px-4 text-left">Valor</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((config) => (
            <tr key={config.key} className="border-t">
              <td className="py-2 px-4">{config.key}</td>
              <td className="py-2 px-4">{config.value}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => onEdit(config)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfigList;