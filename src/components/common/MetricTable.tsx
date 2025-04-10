import React from 'react';
import { BoxIcon } from 'lucide-react';
interface MetricItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: BoxIcon;
  onClick?: () => void;
}
interface MetricTableProps {
  items: MetricItem[];
}
export const MetricTable: React.FC<MetricTableProps> = ({
  items
}) => {
  return <div className="bg-white border border-gray-200 rounded-lg">
      <table className="min-w-full">
        <tbody>
          {items.map((item, index) => {
          const Icon = item.icon;
          return <tr key={index} onClick={item.onClick} className={item.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {Icon && <Icon className="text-blue-600 mr-2" size={20} />}
                    <div>
                      <div className="text-sm text-gray-600">{item.title}</div>
                      {item.subtitle && <div className="text-xs text-gray-400">
                          {item.subtitle}
                        </div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-right">
                  <div className="text-sm font-medium">{item.value}</div>
                </td>
              </tr>;
        })}
        </tbody>
      </table>
    </div>;
};