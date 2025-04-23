import { 
  get, 
  post, 
  put, 
  del 
} from 'aws-amplify/api';

// Generic API service for making authenticated requests
export const apiService = {
  get: async (path: string, queryParams: Record<string, any> = {}) => {
    try {
      const restOperation = await get({
        apiName: 'api',
        path,
        options: {
          queryParams
        }
      });
      
      const response = await restOperation.response;
      const body = await response.body.json();
      
      return {
        body,
        headers: response.headers,
        statusCode: response.statusCode
      };
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  },
  
  post: async (path: string, data: any) => {
    try {
      const restOperation = await post({
        apiName: 'api',
        path,
        options: {
          body: data
        }
      });
      
      const response = await restOperation.response;
      const body = await response.body.json();
      
      return {
        body,
        headers: response.headers,
        statusCode: response.statusCode
      };
    } catch (error) {
      console.error(`Error posting to ${path}:`, error);
      throw error;
    }
  },
  
  put: async (path: string, data: any) => {
    try {
      const restOperation = await put({
        apiName: 'api',
        path,
        options: {
          body: data
        }
      });
      
      const response = await restOperation.response;
      const body = await response.body.json();
      
      return {
        body,
        headers: response.headers,
        statusCode: response.statusCode
      };
    } catch (error) {
      console.error(`Error putting to ${path}:`, error);
      throw error;
    }
  },
  
  delete: async (path: string) => {
    try {
      const restOperation = await del({
        apiName: 'api',
        path
      });
      
      const response = await restOperation.response;
      const body = await response.body.json();
      
      return {
        body,
        headers: response.headers,
        statusCode: response.statusCode
      };
    } catch (error) {
      console.error(`Error deleting from ${path}:`, error);
      throw error;
    }
  }
}; 