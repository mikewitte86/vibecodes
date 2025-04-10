import React from 'react';
interface LogoProps {
  variant?: 'blue' | 'white' | 'black';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}
export const Logo: React.FC<LogoProps> = ({
  variant = 'blue',
  className = '',
  size = 'md',
  alt = 'Equal Parts Logo'
}) => {
  const logoUrl = {
    blue: "/Logo_Equal_Parts_%28Split%29--Blue.png",
    white: "/Logo_Equal_Parts_%28Split%29--White.png",
    black: "/Logo_Equal_Parts_%28Split%29--Black.png"
  };
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  return <img src={logoUrl[variant]} alt={alt} className={`w-auto ${sizeClasses[size]} ${className}`} loading="eager" role="img" />;
};