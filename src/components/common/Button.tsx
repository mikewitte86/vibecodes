import React from 'react';
import { BoxIcon } from 'lucide-react';
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: BoxIcon;
  disabled?: boolean;
  type?: 'button' | 'submit';
}
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  type = 'button'
}) => {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`
        px-4 py-2 rounded-lg inline-flex items-center text-sm
        ${styles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>;
};