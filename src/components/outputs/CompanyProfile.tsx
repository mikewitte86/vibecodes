import React from 'react';
import { Card } from '../common/Card';
import { ArrowLeftIcon, PhoneIcon, MailIcon, MapPinIcon, FileTextIcon, AlertCircleIcon, ClockIcon, BotIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, ArrowRightIcon, StarIcon, LayersIcon, CheckCircleIcon, CircleIcon, ClipboardCheckIcon, FileSignatureIcon, BriefcaseIcon, UserPlusIcon, FileCheckIcon, UserIcon } from 'lucide-react';
const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'upsell':
      return <TrendingUpIcon size={16} className="text-green-600" />;
    case 'cross_sell':
      return <LayersIcon size={16} className="text-blue-600" />;
    case 'coverage_gap':
      return <ShieldIcon size={16} className="text-red-600" />;
    default:
      return null;
  }
};
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-50 text-red-700 border-red-100';
    case 'medium':
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'low':
      return 'bg-green-50 text-green-700 border-green-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};
const getHistoryIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'policy':
      return <FileTextIcon size={16} className="text-blue-600" />;
    case 'contact':
      return <UserIcon size={16} className="text-green-600" />;
    case 'billing':
      return <DollarSignIcon size={16} className="text-purple-600" />;
    case 'service':
      return <CheckCircleIcon size={16} className="text-orange-600" />;
    case 'review':
      return <ClipboardCheckIcon size={16} className="text-indigo-600" />;
    default:
      return <FileTextIcon size={16} className="text-gray-600" />;
  }
};
interface Company {
  id: number;
  name: string;
  activePolicies: number;
  premium: string;
  revenue: string;
  hubspotUrl: string;
}
interface CompanyProfileProps {
  company: Company | null;
  onBack: () => void;
  onPolicyClick: (policyId: number) => void;
}
interface RenewalRecommendation {
  id: number;
  type: 'upsell' | 'cross_sell' | 'coverage_gap';
  title: string;
  description: string;
  estimatedRevenue: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
  icon: React.ReactNode;
}
interface HistoryEvent {
  id: number;
  date: string;
  type: 'policy' | 'contact' | 'billing' | 'service' | 'review';
  title: string;
  description: string;
  user: string;
  metadata?: {
    [key: string]: string;
  };
}
export const CompanyProfile: React.FC<CompanyProfileProps> = ({
  company,
  onBack,
  onPolicyClick
}) => {
  if (!company) {
    return <div className="text-center py-12">
        <p>No company selected.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Companies
        </button>
      </div>;
  }
  const contacts = [{
    id: 1,
    name: 'John Smith',
    role: 'CEO',
    email: 'john@example.com',
    phone: '(555) 123-4567'
  }, {
    id: 2,
    name: 'Sarah Johnson',
    role: 'CFO',
    email: 'sarah@example.com',
    phone: '(555) 987-6543'
  }];
  const policies = [{
    id: 1,
    type: 'General Liability',
    premium: '$12,500',
    expiration: '2023-12-15',
    status: 'Active'
  }, {
    id: 2,
    type: 'Property',
    premium: '$8,000',
    expiration: '2023-10-30',
    status: 'Active'
  }, {
    id: 3,
    type: 'Workers Comp',
    premium: '$4,000',
    expiration: '2023-11-22',
    status: 'Active'
  }];
  const recommendations: RenewalRecommendation[] = [{
    id: 1,
    type: 'coverage_gap',
    title: 'Add Cyber Liability Coverage',
    description: "Based on the client's industry and revenue, there is a significant exposure gap without cyber coverage.",
    estimatedRevenue: '$8,500',
    priority: 'high',
    confidence: 92
  }, {
    id: 2,
    type: 'upsell',
    title: 'Increase General Liability Limits',
    description: "Current limits are below industry standard for the client's size. Recommend increasing from $1M to $2M.",
    estimatedRevenue: '$4,200',
    priority: 'medium',
    confidence: 85
  }, {
    id: 3,
    type: 'cross_sell',
    title: 'Add Employment Practices Liability',
    description: 'Company has grown to 50+ employees, making EPLI coverage essential.',
    estimatedRevenue: '$6,300',
    priority: 'high',
    confidence: 88
  }];
  const historyEvents: HistoryEvent[] = [{
    id: 1,
    date: '2023-01-01',
    type: 'policy',
    title: 'Policy Renewal',
    description: 'General Liability policy renewed for $12,500',
    user: 'John Smith'
  }, {
    id: 2,
    date: '2023-02-01',
    type: 'contact',
    title: 'Contact Update',
    description: 'Updated contact information for Sarah Johnson',
    user: 'John Smith'
  }, {
    id: 3,
    date: '2023-03-01',
    type: 'billing',
    title: 'Billing Update',
    description: 'Updated billing information for the company',
    user: 'John Smith'
  }];
  return <div>
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon size={16} className="mr-1" /> Back to Companies
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
        <p className="text-gray-600">Company profile and account overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Company Information">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="flex items-center mt-1">
                <MapPinIcon size={16} className="mr-2 text-gray-400" />
                123 Business St, Suite 101, San Francisco, CA 94107
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Industry</h4>
              <p className="mt-1">Technology</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Founded</h4>
              <p className="mt-1">2015</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Company Size
              </h4>
              <p className="mt-1">50-100 employees</p>
            </div>
          </div>
        </Card>
        <Card title="Key Contacts">
          <div className="space-y-4">
            {contacts.map(contact => <div key={contact.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.role}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm flex items-center">
                    <MailIcon size={14} className="mr-2 text-gray-400" />
                    {contact.email}
                  </p>
                  <p className="text-sm flex items-center">
                    <PhoneIcon size={14} className="mr-2 text-gray-400" />
                    {contact.phone}
                  </p>
                </div>
              </div>)}
          </div>
        </Card>
        <Card title="Account Summary">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Active Policies
              </h4>
              <p className="text-xl font-bold mt-1">{company.activePolicies}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Total Premium
              </h4>
              <p className="text-xl font-bold mt-1">{company.premium}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Annual Revenue
              </h4>
              <p className="text-xl font-bold mt-1">{company.revenue}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Client Since
              </h4>
              <p className="mt-1">January 2020</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-6">
        <Card title="Policies">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {policies.map(policy => <tr key={policy.id} onClick={() => onPolicyClick(policy.id)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <FileTextIcon size={16} className="mr-2 text-blue-500" />
                        {policy.type}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {policy.premium}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {policy.expiration}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {policy.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Card title={<div className="flex items-center gap-2">
            <BotIcon size={20} className="text-blue-600" />
            <span>Ultron Renewal Recommendations</span>
          </div>}>
        <div className="space-y-6">
          {recommendations.map(rec => <div key={rec.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getRecommendationIcon(rec.type)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}{' '}
                        Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSignIcon size={14} className="text-green-600" />
                        <span className="text-gray-700">
                          Estimated Revenue:{' '}
                        </span>
                        <span className="font-medium text-green-600">
                          {rec.estimatedRevenue}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon size={14} className="text-blue-600" />
                        <span className="text-gray-700">Confidence: </span>
                        <span className="font-medium text-blue-600">
                          {rec.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                  Take Action
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>)}
        </div>
      </Card>
      <Card title={<div className="flex items-center gap-2">
            <ClockIcon size={20} className="text-blue-600" />
            <span>Customer History</span>
          </div>}>
        <div className="space-y-6">
          {historyEvents.map(event => <div key={event.id} className="flex gap-4 border-l-2 border-gray-200 pl-4 pb-6 last:pb-0 relative">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-600">
                {getHistoryIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {event.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                {event.metadata && <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(event.metadata).map(([key, value]) => <span key={key} className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600">
                        {key}: {value}
                      </span>)}
                  </div>}
                <p className="text-xs text-gray-500 mt-2">
                  <UserIcon size={12} className="inline mr-1" />
                  {event.user}
                </p>
              </div>
            </div>)}
        </div>
      </Card>
    </div>;
};