import { Amplify } from 'aws-amplify';

let isConfigured = false;

export function configureAmplify() {
  if (isConfigured) {
    return;
  }

  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!region || !userPoolId || !clientId) {
    throw new Error('Missing required Amplify configuration values');
  }

  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId: clientId,
          loginWith: {
            username: true,
            email: true,
          },
        },
      },
      API: {
        REST: {
          api: {
            endpoint: apiUrl || '',
            region,
          },
        },
      },
    });

    isConfigured = true;
  } catch (error) {
    throw error;
  }
} 