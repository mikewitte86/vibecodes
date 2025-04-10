import React from 'react';

// Import the logo images directly
import logoBlue from '/public/Logo_Equal_Parts_%28Split%29--Blue.png';
import logoWhite from '/public/Logo_Equal_Parts_%28Split%29--White.png';
import logoBlack from '/public/Logo_Equal_Parts_%28Split%29--Black.png';

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
    blue: logoBlue,
    white: logoWhite,
    black: logoBlack
  };
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  return <img src={logoUrl[variant]} alt={alt} className={`w-auto ${sizeClasses[size]} ${className}`} loading="eager" role="img" />;
};