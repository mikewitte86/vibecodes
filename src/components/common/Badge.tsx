import React from 'react';
type BadgeVariant = 'success' | 'warning' | 'error' | 'default' | 'info';
interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>;
};