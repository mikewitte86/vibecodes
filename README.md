# Dashboard App

A modern dashboard application built with Next.js, TypeScript, Tailwind CSS, and AWS Amplify.

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for beautiful UI components
- React Query for data fetching
- React Hook Form with Zod validation
- AWS Amplify for authentication
- Protected routes with middleware
- ESLint and Prettier for code quality

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_AWS_REGION=your-region
   NEXT_PUBLIC_API_URL=your-api-url
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
   NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/contexts/` - React contexts (auth, etc.)
- `src/lib/` - Utility functions and configurations
- `src/middleware.ts` - Route protection middleware

## Authentication

The app uses AWS Amplify for authentication. Protected routes are handled by the middleware, which redirects unauthenticated users to the sign-in page.

## Form Handling

The app uses React Hook Form with Zod for form validation. This provides:
- Type-safe form handling
- Built-in form validation
- Efficient form state management
- Easy integration with UI components

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

This project uses [`