import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { NewPasswordRequired } from './NewPasswordRequired';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { 
    isAuthenticated, 
    loading, 
    newPasswordRequired, 
    completeNewPassword, 
    cancelNewPassword,
    tempUsername 
  } = useAuth();

  // Add debug logging
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, newPasswordRequired });
  }, [isAuthenticated, loading, newPasswordRequired]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (newPasswordRequired) {
    console.log('New password required, showing password change screen');
    return (
      <NewPasswordRequired 
        username={tempUsername} 
        onComplete={completeNewPassword}
        onCancel={cancelNewPassword}
      />
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, showing login page');
    return <LoginPage />;
  }

  console.log('User authenticated, showing protected content');
  return <>{children}</>;
}; 