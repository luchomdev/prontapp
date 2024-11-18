'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/cartStore';
import { FaSignOutAlt } from 'react-icons/fa';
import { signOut } from '@/app/actions/auth';

interface LogoutButtonProps {
  onLogoutComplete?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogoutComplete }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser, setAuthenticated, logout } = useStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    logout: state.logout
  }));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await signOut();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign out');
      }

      logout();

      if (onLogoutComplete) {
        onLogoutComplete();
      }

      router.replace('/');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }finally{
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors duration-300 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <FaSignOutAlt className="mr-2" />
      {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
};

export default LogoutButton;