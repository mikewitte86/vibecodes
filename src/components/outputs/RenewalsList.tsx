import React, { useState } from 'react';
import { Card } from '../common/Card';
import { FilterIcon, AlertCircleIcon, RefreshCcwIcon, RotateCwIcon, DollarSignIcon } from 'lucide-react';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
import { Table } from '../common/Table';
import { MetricTable } from '../common/MetricTable';
import { colors } from '../../styles/colors';
interface Renewal {
  id: number;
  company: string;
  policyType: string;
  expirationDate: string;
  premium: string;
  status: 'Not Started' | 'In Progress' | 'Quoted' | 'Bound';
  daysUntil: number;
}
const mockRenewals: Renewal[] = [{
  id: 1,
  company: 'Acme Corporation',
  policyType: 'General Liability',
  expirationDate: '2023-09-15',
  premium: '$12,500',
  status: 'Not Started',
  daysUntil: 12
}, {
  id: 2,
  company: 'TechCorp Industries',
  policyType: 'Property',
  expirationDate: '2023-09-22',
  premium: '$8,200',
  status: 'In Progress',
  daysUntil: 19
}, {
  id: 3,
  company: 'Global Manufacturing',
  policyType: 'Workers Comp',
  expirationDate: '2023-09-30',
  premium: '$15,750',
  status: 'Quoted',
  daysUntil: 27
}, {
  id: 4,
  company: 'Stellar Services',
  policyType: 'Professional Liability',
  expirationDate: '2023-10-05',
  premium: '$9,300',
  status: 'Not Started',
  daysUntil: 32
}, {
  id: 5,
  company: 'Innovative Solutions',
  policyType: 'Cyber',
  expirationDate: '2023-10-12',
  premium: '$6,800',
  status: 'In Progress',
  daysUntil: 39
}, {
  id: 6,
  company: 'Premier Products',
  policyType: 'General Liability',
  expirationDate: '2023-10-18',
  premium: '$11,200',
  status: 'Not Started',
  daysUntil: 45
}, {
  id: 7,
  company: 'Elite Enterprises',
  policyType: 'Property',
  expirationDate: '2023-10-25',
  premium: '$18,500',
  status: 'Not Started',
  daysUntil: 52
}, {
  id: 8,
  company: 'Dynamic Designs',
  policyType: 'Professional Liability',
  expirationDate: '2023-11-02',
  premium: '$7,900',
  status: 'Not Started',
  daysUntil: 60
}, {
  id: 9,
  company: 'Visionary Ventures',
  policyType: 'Workers Comp',
  expirationDate: '2023-11-10',
  premium: '$14,300',
  status: 'Not Started',
  daysUntil: 68
}, {
  id: 10,
  company: 'Strategic Systems',
  policyType: 'Cyber',
  expirationDate: '2023-11-15',
  premium: '$5,600',
  status: 'Not Started',
  daysUntil: 73
}, {
  id: 11,
  company: 'Pinnacle Partners',
  policyType: 'General Liability',
  expirationDate: '2023-11-22',
  premium: '$10,800',
  status: 'Not Started',
  daysUntil: 80
}, {
  id: 12,
  company: 'Apex Associates',
  policyType: 'Property',
  expirationDate: '2023-11-30',
  premium: '$16,200',
  status: 'Not Started',
  daysUntil: 88
}];
interface RenewalsListProps {
  onPolicyClick: (policyId: number) => void;
}
export const RenewalsList: React.FC<RenewalsListProps> = ({
  onPolicyClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const columns = [{
    key: 'company',
    header: 'Company'
  }, {
    key: 'policyType',
    header: 'Policy Type'
  }, {
    key: 'expirationDate',
    header: 'Expiration Date'
  }, {
    key: 'premium',
    header: 'Premium'
  }, {
    key: 'status',
    header: 'Status',
    render: (value: string) => <Badge variant={value === 'Not Started' ? 'default' : value === 'In Progress' ? 'warning' : value === 'Quoted' ? 'info' : 'success'}>
          {value}
        </Badge>
  }, {
    key: 'daysUntil',
    header: 'Days Until',
    render: (value: number) => <div className={`text-sm flex items-center ${value <= 30 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
          {value <= 30 && <AlertCircleIcon size={16} className="mr-1" />}
          {value} days
        </div>
  }];
  const filteredRenewals = mockRenewals.filter(renewal => renewal.company.toLowerCase().includes(searchTerm.toLowerCase()) || renewal.policyType.toLowerCase().includes(searchTerm.toLowerCase())).filter(renewal => statusFilter === 'all' || renewal.status === statusFilter);
  const statusOptions = [{
    value: 'all',
    label: 'All Statuses'
  }, {
    value: 'Not Started',
    label: 'Not Started'
  }, {
    value: 'In Progress',
    label: 'In Progress'
  }, {
    value: 'Quoted',
    label: 'Quoted'
  }, {
    value: 'Bound',
    label: 'Bound'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Next 90 Renewals</h1>
        <p className="text-gray-600">
          Track and manage upcoming policy renewals.
        </p>
      </div>
      <Card title="Renewal Management">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search renewals..." />
          <div className="flex items-center space-x-2">
            <FilterIcon size={18} className="text-gray-400" />
            <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
          </div>
        </div>
        <Table data={filteredRenewals} columns={columns} onRowClick={item => onPolicyClick(item.id)} />
      </Card>
    </div>;
};