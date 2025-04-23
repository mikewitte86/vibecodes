# AWS Cognito Authentication Setup

This document explains how the AWS Cognito authentication is integrated with this application.

## Architecture

The application uses AWS Cognito for authentication and authorization:

- **AWS Cognito User Pool**: Manages users, authentication, and user attributes
- **AWS Amplify**: Library to interact with Cognito from the frontend
- **React Context**: Manages authentication state throughout the application

## Authentication Flow

1. **User Login**: User enters credentials in the login page
2. **Token Generation**: Upon successful authentication, Cognito issues JWT tokens (ID token, access token, refresh token)
3. **Token Storage**: Tokens are stored securely by Amplify
4. **API Requests**: ID token is included in Authorization header for API requests
5. **Token Refresh**: Amplify automatically handles token refresh when they expire

## Setup Instructions

### 1. AWS Cognito Setup

1. Create a User Pool in AWS Cognito with required attributes:
   - Standard attributes: email, name
   - Custom attributes: 
     - `custom:agency` (String): User's agency identifier
     - `custom:user_role` (String): User's role in the system

2. Create an App Client in the User Pool:
   - Disable client secret for JavaScript applications
   - Enable required OAuth flows

### 2. Environment Variables

Set these environment variables in AWS Amplify:

- `AWS_REGION`: AWS region where Cognito is deployed (e.g., `us-east-1`)
- `COGNITO_USER_POOL_ID`: ID of your Cognito User Pool
- `COGNITO_CLIENT_ID`: ID of your Cognito App Client
- `API_URL`: URL of your API Gateway

### 3. Application Integration

The application is already set up with:

- Authentication context and hooks
- Protected routes that require authentication
- API service for making authenticated requests

## Using Authentication in Components

To access authentication in a component:

```jsx
import { useAuth } from '../../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Access user information
  console.log(user.email, user.agency, user.user_role);
  
  // Make authenticated API calls
  const handleAction = async () => {
    if (isAuthenticated) {
      // API will automatically include the ID token
      const result = await apiService.get('/some-endpoint');
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login('email', 'password')}>Login</button>
      )}
    </div>
  );
}
```

## Token Management

The authentication system handles three types of tokens:

1. **ID Token**: Contains user information (claims) and is used for authentication
2. **Access Token**: Contains permissions and is used for accessing AWS resources
3. **Refresh Token**: Used to obtain new ID and access tokens when they expire

Amplify's Auth module automatically handles token refresh cycles. 