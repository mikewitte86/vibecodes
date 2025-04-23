import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { get } from 'aws-amplify/api';

export function useAuthenticatedApi<T>(endpoint: string, initialData: T) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const restOperation = await get({
        apiName: 'api',
        path: endpoint
      });
      
      const response = await restOperation.response;
      const responseData = await response.body.json();
      setData(responseData as T);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, endpoint]);

  return { data, loading, error, refetch: fetchData };
} 