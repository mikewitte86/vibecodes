import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  // Log environment variables for debugging (not sensitive values)
  console.log('Configuring Amplify with region:', import.meta.env.VITE_AWS_REGION || 'us-east-1');
  console.log('API URL configured:', import.meta.env.VITE_API_URL ? 'Yes' : 'No');
  console.log('User Pool ID configured:', import.meta.env.VITE_COGNITO_USER_POOL_ID ? 'Yes' : 'No');
  console.log('Client ID configured:', import.meta.env.VITE_COGNITO_CLIENT_ID ? 'Yes' : 'No');

  try {
    // Configure Amplify with the correct format for Auth v6
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
          userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
          loginWith: {
            username: true,
            email: true,
          },
        }
      },
      API: {
        REST: {
          api: {
            endpoint: import.meta.env.VITE_API_URL,
            region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
          }
        }
      }
    });
    
    console.log('Amplify configuration successful');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}; 