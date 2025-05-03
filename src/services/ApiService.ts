import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'https://dev.api.equalpartsplatform.io';

// Maintain a cache of active requests to avoid duplicate calls
const requestCache: Map<string, Promise<any>> = new Map();

/**
 * Clear the entire request cache or specific entries
 * @param cacheKey Optional specific cache key to clear
 */
export const clearRequestCache = (cacheKey?: string) => {
  if (cacheKey) {
    requestCache.delete(cacheKey);
  } else {
    requestCache.clear();
  }
};

/**
 * Core API fetch function with proper error handling and caching
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string, // Optional cache key for GET requests
  shouldCache: boolean = false, // Whether to cache this request
  authToken?: string // Allow passing token explicitly
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Use cache if it's a GET request and caching is enabled
  const isGet = !options.method || options.method === 'GET';
  const effectiveCacheKey = cacheKey || (shouldCache && isGet ? url : undefined);
  
  // Return cached promise if available
  if (effectiveCacheKey && requestCache.has(effectiveCacheKey)) {
    return requestCache.get(effectiveCacheKey) as Promise<T>;
  }
  
  // Prepare the fetch operation
  const fetchOperation = async (): Promise<T> => {
    try {
      // Get auth token if not provided
      let token = authToken;
      
      if (!token) {
        // This relies on the hook being used in a component context
        // For standalone usage, token should be passed explicitly
        throw new Error('Authentication token required');
      }
      
      // Log the request for debugging
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      // Prepare headers with auth token
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', token);
      
      if (!headers.has('Content-Type') && !['GET', 'DELETE'].includes(options.method || 'GET')) {
        headers.set('Content-Type', 'application/json');
      }
      
      // Log the headers for debugging (but hide the full token value)
      const debugHeaders: Record<string, string> = {};
      headers.forEach((value, key) => {
        if (key === 'Authorization') {
          debugHeaders[key] = value.substring(0, 20) + '...';
        } else {
          debugHeaders[key] = value;
        }
      });
      console.log('Request headers:', debugHeaders);
      
      // Enhanced fetch with CORS debugging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const fetchOptions = {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'omit' as RequestCredentials, // Don't send cookies for cross-origin requests
        mode: 'cors' as RequestMode, // Explicit CORS mode
      };
      
      // Execute the fetch
      let response: Response;
      try {
        console.log(`Executing fetch to ${url} with options:`, {
          method: fetchOptions.method || 'GET',
          mode: fetchOptions.mode,
          credentials: fetchOptions.credentials
        });
        
        response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error(`Fetch error for ${url}:`, fetchError);
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          throw new Error('Request timed out after 15 seconds');
        }
        throw fetchError;
      }
      
      // Log response headers for debugging
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log(`Response status: ${response.status}, headers:`, responseHeaders);
      
      // Handle unsuccessful responses
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (textError) {
          errorText = 'Could not read error response text';
          console.error('Failed to read error response:', textError);
        }
        
        console.error(`API Error (${response.status}) for ${url}:`, errorText);
        
        let errorMessage = `API Error (${response.status}): `;
        
        try {
          // Try to parse error as JSON
          const errorJson = JSON.parse(errorText);
          console.error('Parsed error JSON:', errorJson);
          errorMessage += errorJson.message || errorJson.error || errorText;
        } catch {
          errorMessage += errorText || response.statusText || 'Unknown error';
        }
        
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = response;
        throw error;
      }
      
      // Parse the successful response
      try {
        const data = await response.json();
        console.log(`API Success for ${url}, data:`, data);
        return data as T;
      } catch (jsonError) {
        console.error(`Failed to parse response as JSON from ${url}:`, jsonError);
        throw new Error(`Failed to parse server response as JSON: ${jsonError}`);
      }
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      
      // Clear this failed request from cache
      if (effectiveCacheKey) {
        requestCache.delete(effectiveCacheKey);
      }
      
      throw error;
    }
  };
  
  // Create the promise and cache it if needed
  const fetchPromise = fetchOperation();
  
  if (effectiveCacheKey) {
    requestCache.set(effectiveCacheKey, fetchPromise);
    
    // Remove from cache when complete (whether success or failure)
    fetchPromise.finally(() => {
      // Only clear automatic cache entries, not explicitly cached ones
      if (!cacheKey && shouldCache) {
        requestCache.delete(effectiveCacheKey);
      }
    });
  }
  
  return fetchPromise;
};

// Hook-based API client that should be used within components
export const useApiClient = () => {
  const { getIdToken } = useAuth();
  
  return {
    async get<T>(endpoint: string, cacheKey?: string, shouldCache: boolean = false): Promise<T> {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<T>(endpoint, { method: 'GET' }, cacheKey, shouldCache, token);
    },
    
    async post<T>(endpoint: string, body: any): Promise<T> {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<T>(
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify(body)
        },
        undefined,
        false,
        token
      );
    },
    
    async put<T>(endpoint: string, body: any): Promise<T> {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<T>(
        endpoint,
        {
          method: 'PUT',
          body: JSON.stringify(body)
        },
        undefined,
        false,
        token
      );
    },
    
    async delete<T>(endpoint: string): Promise<T> {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<T>(endpoint, { method: 'DELETE' }, undefined, false, token);
    },
    
    // Customer-specific API functions
    async fetchAmsCompanies() {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          customers: Array<{
            id: string;
            name: string;
            commercial_name: string;
            status: string;
            [key: string]: any;
          }>;
          count: number;
          [key: string]: any;
        };
      }>('customers/ams', { method: 'GET' }, 'ams-customers-list', true, token);  // Never touch this endpoint dumbass
    },
    
    async fetchCustomers() {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          customers: Array<{
            id: string;
            name: string;
            commercial_name: string;
            status: string;
            [key: string]: any;
          }>;
          count: number;
          [key: string]: any;
        };
      }>('customers', { method: 'GET' }, 'platform-customers-list', true, token);
    },
    
    async fetchCustomerDocuments(customerId: string) {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          documents: Array<{
            id: string;
            document_type: string;
            mime_type: string;
            size_bytes: number;
            created_at: string;
            key: string;
            bucket: string;
            has_analysis: boolean;
            [key: string]: any;
          }>;
          count: number;
          [key: string]: any;
        };
      }>(`customers/${customerId}/documents`, { method: 'GET' }, undefined, false, token);
    },
    
    async chatWithDocument(documentId: string, query: string) {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          response: string;
          [key: string]: any;
        };
      }>(`documents/${documentId}/chat?query=${encodeURIComponent(query)}`, { method: 'GET' }, undefined, false, token);
    },
    
    async getDocumentPresignedUrl(params: {
      bucket: string;
      key: string;
      operation: 'download' | 'upload';
    }) {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          url: string;
          object_key: string;
          expiration_seconds: number;
          operation: string;
        };
      }>('documents/presigned_url', {
        method: 'POST',
        body: JSON.stringify(params)
      }, undefined, false, token);
    },
    
    async getUploadPresignedUrl(params: {
      filename: string;
      customer_id: string;
      policy_id: string;
      document_type: string;
      content_type: string;
      operation: 'upload';
    }) {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication required');
      return apiFetch<{
        statusCode: number;
        body: {
          url: string;
          object_key: string;
          expiration_seconds: number;
          operation: string;
        };
      }>('documents/presigned_url', {
        method: 'POST',
        body: JSON.stringify(params)
      }, undefined, false, token);
    }
  };
}; 