'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, AuthUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/amplify';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        configureAmplify();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        Cookies.set('auth-token', 'true', { expires: 7 });
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('auth-token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      await amplifySignIn({ username, password });
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      Cookies.set('auth-token', 'true', { expires: 7 });
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove('auth-token');
      router.push('/auth/signin');
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 