import React from 'react';
import { LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // No need to redirect - the ProtectedRoute component will handle this
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
      <LogOutIcon size={16} />
      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}; 