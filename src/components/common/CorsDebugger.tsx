import React, { useState } from 'react';
import { testCorsConfiguration } from '../../corsDisabler';

/**
 * CorsDebugger component for testing and debugging CORS issues
 * DEVELOPMENT USE ONLY - should be conditionally rendered only in development
 */
export const CorsDebugger: React.FC = () => {
  const [url, setUrl] = useState('https://dev.equalpartsplatform.io/customers');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const handleTest = async () => {
    if (!url) return;
    
    setIsTesting(true);
    try {
      await testCorsConfiguration(url);
    } catch (error) {
      console.error('CORS test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };
  
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-50 border border-yellow-200 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div 
          className="bg-yellow-100 p-2 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="font-medium text-yellow-800">CORS Debugger</span>
          <button className="text-yellow-700">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
        
        {/* Content */}
        {isExpanded && (
          <div className="p-3">
            <p className="text-xs text-yellow-800 mb-2">
              Test endpoints for CORS configuration. This will help diagnose CORS issues.
            </p>
            
            <div className="flex mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/api/endpoint"
                className="flex-1 px-2 py-1 text-sm border border-yellow-300 rounded-l focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <button
                onClick={handleTest}
                disabled={isTesting || !url}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-r hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            <div className="text-xs text-yellow-700">
              <p>Common endpoints to test:</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>
                  <button 
                    className="text-yellow-600 hover:underline" 
                    onClick={() => setUrl('https://dev.equalpartsplatform.io/customers')}
                  >
                    Customers API
                  </button>
                </li>
                <li>
                  <button 
                    className="text-yellow-600 hover:underline" 
                    onClick={() => setUrl('https://dev.equalpartsplatform.io/documents/presigned_url')}
                  >
                    Presigned URL endpoint
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 