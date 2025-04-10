import React from 'react';
import { BoxIcon } from 'lucide-react';
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: BoxIcon;
  onClick?: () => void;
  isSelected?: boolean;
  subtitle?: string;
}
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  onClick,
  isSelected,
  subtitle
}) => {
  return <div className={`bg-white rounded-lg shadow-sm border ${isSelected ? 'border-[#2563EB]' : 'border-gray-200'} p-4 ${onClick ? 'cursor-pointer transition-transform hover:scale-105' : ''}`} onClick={onClick}>
      <div>
        <div className="flex items-center mb-2">
          {Icon && <Icon size={20} className="text-[#2563EB] mr-2" />}
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {change && <div className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </div>}
      </div>
    </div>;
};