import React from 'react';
import { BoxIcon } from 'lucide-react';
interface DataFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: BoxIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
}
export const DataField: React.FC<DataFieldProps> = ({
  label,
  value,
  icon: Icon,
  size = 'md',
  className = '',
  labelClassName = '',
  valueClassName = '',
  iconClassName = ''
}) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return <div className={`space-y-1 ${className}`}>
      <p className={`${sizes[size]} text-gray-500 ${labelClassName}`}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className={`text-gray-400 ${iconClassName}`} />}
        <p className={`${sizes[size]} font-medium text-gray-900 ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>;
};