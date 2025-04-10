import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from './Button';
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack
}) => {
  return <div className="mb-6">
      {onBack && <Button variant="outline" size="sm" icon={ArrowLeftIcon} onClick={onBack} className="mb-4">
          Back
        </Button>}
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>;
};