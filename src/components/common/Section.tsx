import React from 'react';
interface SectionProps {
  title?: string;
  children: React.ReactNode;
}
export const Section: React.FC<SectionProps> = ({
  title,
  children
}) => {
  return <div className="bg-white border border-gray-200 rounded-lg">
      {title && <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium">{title}</h3>
        </div>}
      <div className="p-4">{children}</div>
    </div>;
};