import React, { useState } from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { Table } from '../common/Table';
interface Company {
  id: number;
  name: string;
  activePolicies: number;
  premium: string;
  revenue: string;
  hubspotUrl: string;
}
const mockCompanies: Company[] = [{
  id: 1,
  name: 'Acme Corporation',
  activePolicies: 3,
  premium: '$24,500',
  revenue: '$4,900',
  hubspotUrl: '#'
}, {
  id: 2,
  name: 'TechCorp Industries',
  activePolicies: 2,
  premium: '$18,750',
  revenue: '$3,750',
  hubspotUrl: '#'
}, {
  id: 3,
  name: 'Global Manufacturing',
  activePolicies: 5,
  premium: '$56,200',
  revenue: '$11,240',
  hubspotUrl: '#'
}, {
  id: 4,
  name: 'Stellar Services',
  activePolicies: 1,
  premium: '$8,300',
  revenue: '$1,660',
  hubspotUrl: '#'
}, {
  id: 5,
  name: 'Innovative Solutions',
  activePolicies: 4,
  premium: '$32,100',
  revenue: '$6,420',
  hubspotUrl: '#'
}, {
  id: 6,
  name: 'Premier Products',
  activePolicies: 2,
  premium: '$19,800',
  revenue: '$3,960',
  hubspotUrl: '#'
}, {
  id: 7,
  name: 'Elite Enterprises',
  activePolicies: 3,
  premium: '$27,500',
  revenue: '$5,500',
  hubspotUrl: '#'
}, {
  id: 8,
  name: 'Dynamic Designs',
  activePolicies: 1,
  premium: '$12,400',
  revenue: '$2,480',
  hubspotUrl: '#'
}];
interface CompanyListProps {
  onSelectCompany: (company: Company) => void;
}
export const CompanyList: React.FC<CompanyListProps> = ({
  onSelectCompany
}) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sortedCompanies = mockCompanies.sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortField === 'activePolicies') {
      return sortDirection === 'asc' ? a.activePolicies - b.activePolicies : b.activePolicies - a.activePolicies;
    } else if (sortField === 'premium') {
      return sortDirection === 'asc' ? a.premium.localeCompare(b.premium) : b.premium.localeCompare(a.premium);
    } else if (sortField === 'revenue') {
      return sortDirection === 'asc' ? a.revenue.localeCompare(b.revenue) : b.revenue.localeCompare(a.revenue);
    }
    return 0;
  });
  const columns = [{
    key: 'name',
    header: 'Company Name',
    sortable: true
  }, {
    key: 'activePolicies',
    header: 'Active Policies',
    sortable: true
  }, {
    key: 'premium',
    header: 'Premium',
    sortable: true
  }, {
    key: 'revenue',
    header: 'Revenue',
    sortable: true
  }, {
    key: 'hubspotUrl',
    header: 'Actions',
    render: (value: string) => <a href={value} className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1" onClick={e => e.stopPropagation()}>
          <span>HubSpot</span>
          <ExternalLinkIcon size={14} />
        </a>
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <p className="text-gray-600">View and manage all client companies.</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table data={sortedCompanies} columns={columns} sortField={sortField} sortDirection={sortDirection} onSort={field => {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field as string);
          setSortDirection('asc');
        }
      }} onRowClick={company => onSelectCompany(company)} />
      </div>
    </div>;
};