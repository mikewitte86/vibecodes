import React, { useState } from 'react';
import { AlertTriangleIcon } from 'lucide-react';

interface NewPasswordRequiredProps {
  username: string;
  onComplete: (newPassword: string) => Promise<void>;
  onCancel: () => void;
}

export const NewPasswordRequired: React.FC<NewPasswordRequiredProps> = ({ 
  username, 
  onComplete,
  onCancel
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must include at least one uppercase letter');
      return;
    }
    
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must include at least one lowercase letter');
      return;
    }
    
    if (!/[0-9]/.test(newPassword)) {
      setError('Password must include at least one number');
      return;
    }
    
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('Password must include at least one special character (like !@#$%^&*)');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await onComplete(newPassword);
      // Success will be handled by the parent component
    } catch (err: any) {
      console.error('Password change failed:', err);
      
      // More detailed error handling
      if (err.name === 'InvalidPasswordException') {
        // Parse the specific requirements from Cognito's error message
        const errorMessage = err.message || '';
        
        if (errorMessage.includes('symbol characters')) {
          setError('Password must include at least one special character (like !@#$%^&*)');
        } else if (errorMessage.includes('uppercase characters')) {
          setError('Password must include at least one uppercase letter');
        } else if (errorMessage.includes('lowercase characters')) {
          setError('Password must include at least one lowercase letter');
        } else if (errorMessage.includes('numeric characters')) {
          setError('Password must include at least one number');
        } else if (errorMessage.includes('length')) {
          setError('Password must be at least 8 characters long');
        } else {
          // If we can't parse a specific requirement, show the full error
          setError(`Password doesn't meet requirements: ${errorMessage}`);
        }
      } else if (err.message?.includes('Password does not conform')) {
        setError('Password must include uppercase, lowercase, number, and special character');
      } else {
        setError(err.message || 'Failed to set new password. Please try again.');
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
            Change Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account requires a password change. Please set a new password to continue.
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <div className="flex">
              <AlertTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Email</label>
              <input
                id="username"
                name="username"
                type="text"
                disabled
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={username}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="sr-only">New Password</label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Change Password'}
            </button>
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-semibold">Password requirements:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>At least 8 characters long</li>
                <li>Include at least one uppercase letter (A-Z)</li>
                <li>Include at least one lowercase letter (a-z)</li>
                <li>Include at least one number (0-9)</li>
                <li>Include at least one special character (!@#$%^&*)</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 