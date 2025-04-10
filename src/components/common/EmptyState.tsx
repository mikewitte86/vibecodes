import React, { Component } from 'react';
import { BoxIcon } from 'lucide-react';
import { Button } from './Button';
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ComponentType<{
    size: number;
    className?: string;
  }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = BoxIcon,
  action
}) => {
  return <div className="text-center py-12">
      <Icon size={40} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>;
};