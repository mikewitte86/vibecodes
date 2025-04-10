import React from 'react';
interface DataDisplayProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}
export const DataDisplay: React.FC<DataDisplayProps> = ({
  label,
  value,
  icon
}) => {
  return <div className="space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <p className="font-medium">{value}</p>
      </div>
    </div>;
};