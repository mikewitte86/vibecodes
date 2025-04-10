import React from 'react';
interface DataGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}
export const DataGrid: React.FC<DataGridProps> = ({
  children,
  columns = 2,
  gap = 6,
  className = ''
}) => {
  return <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap} ${className}`}>
      {children}
    </div>;
};