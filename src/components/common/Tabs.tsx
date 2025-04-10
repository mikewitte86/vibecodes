import React from 'react';
interface Tab {
  value: string;
  label: string;
}
interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange
}) => {
  return <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => <button key={tab.value} onClick={() => onChange(tab.value)} className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${tab.value === value ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}>
            {tab.label}
          </button>)}
      </nav>
    </div>;
};