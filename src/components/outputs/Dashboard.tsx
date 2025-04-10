import React, { useState } from 'react';
import { Card } from '../common/Card';
import { MetricCard } from '../common/MetricCard';
import { MetricTable } from '../common/MetricTable';
import { DollarSignIcon, UsersIcon, FileTextIcon, AlertCircleIcon, CheckIcon, ClipboardIcon, ArrowRightIcon, CheckSquareIcon, ClockIcon, HelpCircleIcon, TrendingUpIcon, RefreshCcwIcon, RotateCwIcon } from 'lucide-react';
interface ActivityItem {
  id: number;
  type: 'policy' | 'contact' | 'renewal' | 'task' | 'deal';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}
interface DashboardProps {
  onTaskFilterClick: (filter: {
    status: string;
    priority: string;
  }) => void;
  onActivityClick: (type: string, id: number) => void;
  onNavigate: (section: string, view: string) => void;
}
export const Dashboard: React.FC<DashboardProps> = ({
  onTaskFilterClick,
  onActivityClick,
  onNavigate
}) => {
  const [showAllActivity, setShowAllActivity] = useState(false);
  const mockActivities: ActivityItem[] = [{
    id: 1,
    type: 'policy',
    title: 'New policy created for Acme Inc.',
    description: 'General Liability Policy - $1.2M coverage',
    timestamp: '2 hours ago',
    user: 'Jane Smith',
    icon: <FileTextIcon size={16} />,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  }, {
    id: 2,
    type: 'contact',
    title: 'New contact added: John Doe',
    description: 'Primary Contact - TechCorp',
    timestamp: 'Yesterday',
    user: 'Mike Johnson',
    icon: <UsersIcon size={16} />,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }, {
    id: 3,
    type: 'renewal',
    title: 'Renewal alert: Global Industries',
    description: 'Policy expiring in 30 days - $56,200 premium',
    timestamp: '2 days ago',
    user: 'System',
    icon: <AlertCircleIcon size={16} />,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  }, {
    id: 4,
    type: 'task',
    title: 'Task completed: Certificate request',
    description: 'Processed for Dynamic Designs',
    timestamp: '2 days ago',
    user: 'Jane Smith',
    icon: <CheckSquareIcon size={16} />,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }, {
    id: 5,
    type: 'deal',
    title: 'New business opportunity',
    description: 'Quantum Solutions - $15,800 estimated premium',
    timestamp: '3 days ago',
    user: 'Mike Johnson',
    icon: <DollarSignIcon size={16} />,
    iconBgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }];
  const displayedActivities = showAllActivity ? mockActivities : mockActivities.slice(0, 3);
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your agency's key metrics and performance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Premium" value="$1.2M" change="12% from last period" isPositive={true} icon={DollarSignIcon} onClick={() => onNavigate('outputs', 'policies')} />
        <MetricCard title="Active Clients" value="124" change="8% from last period" isPositive={true} icon={UsersIcon} onClick={() => onNavigate('outputs', 'companies')} />
        <MetricCard title="Active Policies" value="256" change="5% from last period" isPositive={true} icon={FileTextIcon} onClick={() => onNavigate('outputs', 'policies')} />
        <MetricCard title="Pending Renewals" value="18" change="2 due this week" isPositive={false} icon={AlertCircleIcon} onClick={() => onNavigate('outputs', 'renewals')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Renewal Status">
          <MetricTable items={[{
          title: 'Total Renewals',
          value: '32',
          subtitle: 'Next 90 days',
          icon: RefreshCcwIcon
        }, {
          title: 'Not Started',
          value: '15',
          subtitle: 'Need attention',
          icon: AlertCircleIcon,
          onClick: () => onNavigate('outputs', 'renewals')
        }, {
          title: 'In Progress',
          value: '12',
          subtitle: 'Being processed',
          icon: RotateCwIcon
        }, {
          title: 'Total Premium',
          value: '$450K',
          subtitle: 'Renewable premium',
          icon: DollarSignIcon
        }]} />
        </Card>
        <Card title="Invoice Status">
          <MetricTable items={[{
          title: 'Outstanding Amount',
          value: '$110.5K',
          subtitle: 'Total unpaid',
          icon: DollarSignIcon,
          onClick: () => onNavigate('outputs', 'invoices')
        }, {
          title: 'Overdue Invoices',
          value: '5',
          subtitle: 'Need attention',
          icon: AlertCircleIcon,
          onClick: () => onNavigate('outputs', 'invoices')
        }, {
          title: 'Pending Invoices',
          value: '12',
          subtitle: 'Awaiting payment',
          icon: ClockIcon,
          onClick: () => onNavigate('outputs', 'invoices')
        }, {
          title: 'Paid This Month',
          value: '$245K',
          subtitle: 'Monthly total',
          icon: CheckIcon
        }]} />
        </Card>
      </div>
      <Card title="Recent Activity">
        <div className="space-y-3">
          {displayedActivities.map(activity => <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer" onClick={() => onActivityClick(activity.type, activity.id)}>
              <div className={`w-10 h-10 rounded-full ${activity.iconBgColor} flex items-center justify-center mr-3`}>
                <div className={activity.iconColor}>{activity.icon}</div>
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <ClockIcon size={12} className="mr-1" />
                  <span>{activity.timestamp}</span>
                  <span className="mx-2">•</span>
                  <UsersIcon size={12} className="mr-1" />
                  <span>{activity.user}</span>
                </div>
              </div>
            </div>)}
        </div>
        {mockActivities.length > 3 && <div className="mt-4 text-center">
            <button onClick={() => setShowAllActivity(!showAllActivity)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto">
              {showAllActivity ? 'Show Less' : 'See More'}
              {!showAllActivity && <ArrowRightIcon size={16} className="ml-1" />}
            </button>
          </div>}
      </Card>
    </div>;
};