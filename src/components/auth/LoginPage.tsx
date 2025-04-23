import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangleIcon } from 'lucide-react';

// Create a global variable to store login error state outside of React's state management
let globalLoginError: string | null = null;

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const { login, loading: authLoading } = useAuth();
  
  // Add useEffect for debugging
  useEffect(() => {
    console.log('LoginPage mounted');
    // Log if auth context is available but don't log sensitive values
    console.log('Auth context available:', !!login);
    
    // Check if there's a global error from a previous login attempt
    if (globalLoginError) {
      setError(globalLoginError);
      setShowError(true);
      console.log('Restored error from global state:', globalLoginError);
    }
  }, [login]);

  // Add effect to monitor error state for debugging
  useEffect(() => {
    console.log('Error state updated:', error);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Email and password are required');
      setShowError(true);
      return;
    }
    
    setError(null);
    setShowError(false);
    globalLoginError = null;
    setIsLoading(true);
    
    try {
      console.log('Attempting login with username:', username);
      await login(username, password);
      console.log('Login successful');
      // Successful login will update the auth context
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Set error message based on error type
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.name === 'NotAuthorizedException' && err.message.includes('Incorrect username or password')) {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Your account is not verified. Please check your email for verification instructions.';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'Account not found. Please check your email or sign up for a new account.';
      } else if (err.name === 'TooManyRequestsException') {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (err.message && err.message.includes('Additional authentication steps required')) {
        errorMessage = 'Additional authentication required. Please contact support.';
      }
      
      // Store error in global state and in React state
      globalLoginError = errorMessage;
      setError(errorMessage);
      setShowError(true);
      
      // Force update the DOM directly
      const errorContainer = document.getElementById('error-message-container');
      const errorText = document.getElementById('error-message-text');
      if (errorContainer && errorText) {
        errorContainer.style.display = 'block';
        errorText.innerText = errorMessage;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {/* React-based error display */}
        {error && showError && (
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <div className="flex">
              <AlertTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Direct DOM error display - This will work even if React state fails */}
        <div 
          id="error-message-container" 
          className="rounded-md bg-red-50 p-4 border border-red-100" 
          style={{ display: 'none' }}
        >
          <div className="flex">
            <AlertTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            <div className="ml-3">
              <h3 id="error-message-text" className="text-sm font-medium text-red-800"></h3>
            </div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Email address</label>
              <input
                id="username"
                name="username"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || authLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || authLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading || authLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 