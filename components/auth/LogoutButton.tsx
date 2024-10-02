'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/cartStore';
import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
  onLogoutComplete?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogoutComplete }) => {
  const router = useRouter();
  const { setUser, setAuthenticated } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
  }));

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      setAuthenticated(false);

      if (onLogoutComplete) {
        onLogoutComplete();
      }

      router.push('/');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors duration-300"
    >
      <FaSignOutAlt className="mr-2" />
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;