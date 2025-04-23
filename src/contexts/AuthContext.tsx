import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchAuthSession, 
  signIn, 
  signOut,
  getCurrentUser, 
  type SignInOutput
} from 'aws-amplify/auth';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  agency?: string;
  user_role?: string;
  idToken: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    console.log('AuthProvider - Checking authentication state');
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('Checking auth state...');
      const authUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      // Extract tokens
      const idToken = session.tokens?.idToken?.toString() || '';
      const accessToken = session.tokens?.accessToken?.toString() || '';
      
      console.log('User authenticated, ID:', authUser.userId);
      
      // Extract user attributes from the ID token
      setUser({
        id: authUser.userId,
        username: authUser.username,
        email: authUser.signInDetails?.loginId || '',
        name: '', // Fetch user attributes if needed
        agency: '', // Fetch user attributes if needed
        user_role: '', // Fetch user attributes if needed
        idToken,
        accessToken
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.log('User not authenticated', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('Login attempt starting');
      setLoading(true);
      
      // Use the signIn function from Amplify Auth v6
      const signInOutput = await signIn({
        username,
        password,
      });
      
      console.log('Sign in result:', signInOutput);
      
      if (signInOutput.isSignedIn) {
        // Successful login, fetch session and user data
        const session = await fetchAuthSession();
        const authUser = await getCurrentUser();
        
        // Extract tokens
        const idToken = session.tokens?.idToken?.toString() || '';
        const accessToken = session.tokens?.accessToken?.toString() || '';
        
        console.log('Login successful, user ID:', authUser.userId);
        
        setUser({
          id: authUser.userId,
          username: authUser.username,
          email: authUser.signInDetails?.loginId || '',
          name: '', // Fetch user attributes if needed
          agency: '', // Fetch user attributes if needed
          user_role: '', // Fetch user attributes if needed
          idToken,
          accessToken
        });
        
        setIsAuthenticated(true);
      } else {
        // Handle other authentication steps if needed (MFA, etc.)
        console.log('Additional authentication steps required:', signInOutput.nextStep?.signInStep);
        throw new Error(`Additional authentication steps required: ${signInOutput.nextStep?.signInStep}`);
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      
      // Ensure the error has a name property before rethrowing
      if (!error.name) {
        error.name = 'AuthError';
      }
      
      // Add more detailed error message before rethrowing
      if (error.name === 'NotAuthorizedException') {
        // Make sure we're returning a correctly formed error
        console.error('Authentication failed - incorrect credentials');
        throw error;
      } else if (error.name === 'UserNotConfirmedException') {
        // Handle unconfirmed user
        throw error;
      } else if (error.name === 'UserNotFoundException') {
        // Handle user not found
        throw error;
      } else {
        // For other errors, ensure they have a readable message
        const errorMessage = error.message || 'An unknown error occurred during login';
        const enhancedError = new Error(errorMessage);
        enhancedError.name = error.name || 'AuthError';
        throw enhancedError;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  // Function to refresh the session if needed
  const refreshSession = async () => {
    try {
      const session = await fetchAuthSession();
      // Amplify handles the refresh internally if needed
      return {
        idToken: session.tokens?.idToken?.toString() || null,
        accessToken: session.tokens?.accessToken?.toString() || null
      };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated, 
        login, 
        logout, 
        getIdToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 