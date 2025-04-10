import React from 'react';
interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  actions
}) => {
  return <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="font-medium text-gray-700">{title}</div>
          {actions}
        </div>}
      <div className="p-4">{children}</div>
    </div>;
};