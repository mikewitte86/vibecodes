// This script provides CORS debugging functionality for development
// DO NOT USE IN PRODUCTION - for development and testing only

/**
 * Initialize CORS debugging
 * This sets up global handlers to detect and log CORS errors
 */
export const setupCorsDisabler = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('CORS debugging initialized - for development purposes only');
    
    // Listen for unhandled fetch errors which might be CORS related
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('NetworkError') || 
           event.reason.message.includes('CORS') || 
           event.reason.message.includes('network error'))) {
        console.error('Potential CORS error detected:', event.reason);
        logCorsHelp();
      }
    });
  }
};

/**
 * Log helpful information for debugging CORS issues
 */
const logCorsHelp = () => {
  console.warn(`
    ================================
    CORS ISSUE DETECTED
    ================================
    
    Possible solutions:
    1. Ensure the API server has proper CORS headers configured
       - Access-Control-Allow-Origin: ${window.location.origin}
       - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
       - Access-Control-Allow-Headers: Content-Type, Authorization
    
    2. Check API request configuration:
       - credentials: 'omit' (for cross-origin requests)
       - mode: 'cors'
    
    3. For S3 uploads, ensure bucket CORS configuration allows:
       - PUT requests from ${window.location.origin}
    
    4. For local development only, try a CORS proxy (see fetchWithoutCors method)
    ================================
  `);
};

/**
 * Try multiple CORS proxies in sequence
 * DEVELOPMENT USE ONLY - DO NOT USE IN PRODUCTION
 */
export const fetchWithoutCors = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('fetchWithoutCors should only be used in development');
  }
  
  // List of CORS proxies to try
  const corsProxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url='
  ];
  
  let lastError: Error | null = null;
  
  // Try each proxy in sequence
  for (const proxyUrl of corsProxies) {
    try {
      const fullUrl = proxyUrl + encodeURIComponent(url);
      console.log(`Trying CORS proxy: ${proxyUrl}`);
      
      const response = await fetch(fullUrl, options);
      return response;
    } catch (err) {
      console.warn(`Proxy ${proxyUrl} failed:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  
  // If all proxies fail, try a direct request as a last resort
  try {
    console.log('All proxies failed, trying direct request');
    return await fetch(url, options);
  } catch (err) {
    logCorsHelp();
    throw lastError || (err instanceof Error ? err : new Error(String(err)));
  }
};

/**
 * Diagnostic function for testing CORS configuration
 * Useful for verifying CORS setup during development
 */
export const testCorsConfiguration = async (url: string): Promise<void> => {
  console.log(`Testing CORS configuration for: ${url}`);
  
  try {
    // Test preflight OPTIONS request
    const optionsResponse = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      },
      mode: 'cors'
    });
    
    console.log('OPTIONS request result:', {
      status: optionsResponse.status,
      ok: optionsResponse.ok,
      headers: Array.from(optionsResponse.headers.entries())
    });
    
    // Test actual GET request
    const getResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Origin': window.location.origin
      },
      mode: 'cors'
    });
    
    console.log('GET request result:', {
      status: getResponse.status,
      ok: getResponse.ok,
      headers: Array.from(getResponse.headers.entries())
    });
    
    console.log('CORS test completed successfully');
  } catch (error) {
    console.error('CORS test failed:', error);
    logCorsHelp();
  }
}; 