import React from 'react';
import { FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  user_role: string;
  is_active: boolean;
}

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onToggleActive: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onToggleActive }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-semibold">{user.name} {user.last_name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500">Rol: {user.user_role}</p>
        <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {user.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700"
          title="Editar"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={onToggleActive}
          className={`${user.is_active ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
          title={user.is_active ? 'Desactivar' : 'Activar'}
        >
          {user.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
        </button>
      </div>
    </div>
  );
};

export default UserCard;