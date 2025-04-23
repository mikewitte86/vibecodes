import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPage } from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Add debug logging
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, showing login page');
    return <LoginPage />;
  }

  console.log('User authenticated, showing protected content');
  return <>{children}</>;
}; 