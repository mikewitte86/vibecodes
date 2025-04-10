import React, { useState } from 'react';
import { Card } from '../common/Card';
import { SearchIcon, FilterIcon, TrendingUpIcon, UsersIcon, CalendarIcon, DollarSignIcon, CheckIcon, ClipboardIcon, RotateCwIcon, AlertCircleIcon, CheckSquareIcon } from 'lucide-react';
import { MetricTable } from '../common/MetricTable';
interface Deal {
  id: number;
  company: string;
  contact: string;
  stage: 'Lead' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: string;
  source: string;
  createdDate: string;
  lastActivity: string;
}
interface NewBusinessProps {
  onCompanyClick: (company: {
    id: number;
    name: string;
  }) => void;
}
const mockDeals: Deal[] = [{
  id: 1,
  company: 'Nexus Technologies',
  contact: 'John Smith',
  stage: 'Lead',
  value: '$8,500',
  source: 'Website',
  createdDate: '2023-08-15',
  lastActivity: '2023-09-01'
}, {
  id: 2,
  company: 'Pinnacle Enterprises',
  contact: 'Sarah Johnson',
  stage: 'Qualification',
  value: '$12,200',
  source: 'Referral',
  createdDate: '2023-08-10',
  lastActivity: '2023-08-30'
}, {
  id: 3,
  company: 'Quantum Solutions',
  contact: 'Michael Brown',
  stage: 'Proposal',
  value: '$15,800',
  source: 'Cold Call',
  createdDate: '2023-08-05',
  lastActivity: '2023-08-28'
}, {
  id: 4,
  company: 'Vertex Industries',
  contact: 'Emily Davis',
  stage: 'Negotiation',
  value: '$22,500',
  source: 'LinkedIn',
  createdDate: '2023-07-25',
  lastActivity: '2023-08-20'
}, {
  id: 5,
  company: 'Summit Corp',
  contact: 'David Wilson',
  stage: 'Closed Won',
  value: '$18,300',
  source: 'Event',
  createdDate: '2023-07-15',
  lastActivity: '2023-08-15'
}, {
  id: 6,
  company: 'Horizon Group',
  contact: 'Jennifer Lee',
  stage: 'Closed Lost',
  value: '$9,700',
  source: 'Website',
  createdDate: '2023-07-10',
  lastActivity: '2023-08-05'
}, {
  id: 7,
  company: 'Apex Partners',
  contact: 'Robert Taylor',
  stage: 'Lead',
  value: '$11,200',
  source: 'Referral',
  createdDate: '2023-08-20',
  lastActivity: '2023-09-03'
}, {
  id: 8,
  company: 'Catalyst Innovations',
  contact: 'Amanda Martin',
  stage: 'Qualification',
  value: '$16,500',
  source: 'Cold Call',
  createdDate: '2023-08-18',
  lastActivity: '2023-09-02'
}];
export const NewBusiness: React.FC<NewBusinessProps> = ({
  onCompanyClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const filteredDeals = mockDeals.filter(deal => deal.company.toLowerCase().includes(searchTerm.toLowerCase()) || deal.contact.toLowerCase().includes(searchTerm.toLowerCase())).filter(deal => stageFilter === 'all' || deal.stage === stageFilter);
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead':
        return 'bg-gray-100 text-gray-800';
      case 'Qualification':
        return 'bg-blue-100 text-blue-800';
      case 'Proposal':
        return 'bg-indigo-100 text-indigo-800';
      case 'Negotiation':
        return 'bg-purple-100 text-purple-800';
      case 'Closed Won':
        return 'bg-green-100 text-green-800';
      case 'Closed Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const totalDeals = mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => {
    const value = parseFloat(deal.value.replace(/[$,]/g, ''));
    return sum + value;
  }, 0);
  const wonDeals = mockDeals.filter(deal => deal.stage === 'Closed Won').length;
  const activeDeals = mockDeals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage)).length;
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Business</h1>
        <p className="text-gray-600">
          Manage and track new business opportunities.
        </p>
      </div>
      <Card title="Deal Pipeline">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <input type="text" placeholder="Search deals..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon size={18} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FilterIcon size={18} className="text-gray-400" />
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
              <option value="all">All Stages</option>
              <option value="Lead">Lead</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map(deal => <tr key={deal.id} onClick={() => onCompanyClick({
              id: deal.id,
              name: deal.company
            })} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {deal.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <UsersIcon size={16} className="mr-1 text-gray-400" />
                      {deal.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deal.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deal.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <CalendarIcon size={16} className="mr-1 text-gray-400" />
                      {deal.createdDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <CalendarIcon size={16} className="mr-1 text-gray-400" />
                      {deal.lastActivity}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
};