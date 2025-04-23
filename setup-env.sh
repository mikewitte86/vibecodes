#!/bin/bash

# This script sets up environment variables for local development
# You need to fill in the values before running

echo "Creating .env file for local development"

cat > .env << EOL
# Development environment - Replace these values with your actual Cognito configuration
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_EZPELLuBS
VITE_COGNITO_CLIENT_ID=7993nd1ldv7e4fbtpku7d3unqe
VITE_API_URL=https://your-api-url.com
EOL

echo "Created .env file"
echo "Please edit this file with your actual Cognito configuration values"
echo "Then restart your development server" 