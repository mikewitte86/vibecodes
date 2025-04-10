import React from 'react';
import { FileTextIcon } from 'lucide-react';
import { DataList } from '../common/DataList';
import { StatusBadge } from '../common/StatusBadge';
interface Policy {
  id: number;
  company: string;
  type: string;
  status: 'Active' | 'Pending' | 'Cancelled' | 'Expired';
  premium: string;
  carrier: string;
  effectiveDate: string;
  policyNumber: string;
}
interface PoliciesListProps {
  onPolicyClick: (policyId: number) => void;
}
const mockPolicies: Policy[] = [{
  id: 1,
  company: 'Acme Corporation',
  type: 'General Liability',
  status: 'Active',
  premium: '$12,500',
  carrier: 'Insurance Co',
  effectiveDate: '2023-01-01',
  policyNumber: 'GL-123456'
}, {
  id: 2,
  company: 'TechCorp Industries',
  type: 'Professional Liability',
  status: 'Active',
  premium: '$8,200',
  carrier: 'Tech Insure',
  effectiveDate: '2023-03-15',
  policyNumber: 'PL-789012'
}, {
  id: 3,
  company: 'Global Manufacturing',
  type: 'Property',
  status: 'Active',
  premium: '$15,750',
  carrier: 'Property Guard',
  effectiveDate: '2023-02-01',
  policyNumber: 'PR-345678'
}, {
  id: 4,
  company: 'Stellar Services',
  type: 'Workers Comp',
  status: 'Pending',
  premium: '$9,300',
  carrier: 'Workers First',
  effectiveDate: '2023-09-01',
  policyNumber: 'WC-901234'
}, {
  id: 5,
  company: 'Innovative Solutions',
  type: 'Cyber',
  status: 'Active',
  premium: '$6,800',
  carrier: 'Cyber Shield',
  effectiveDate: '2023-06-15',
  policyNumber: 'CY-567890'
}];
export const PoliciesList: React.FC<PoliciesListProps> = ({
  onPolicyClick
}) => {
  return <DataList title="Policies" subtitle="View and manage all insurance policies" data={mockPolicies} columns={[{
    key: 'company',
    header: 'Company',
    sortable: true
  }, {
    key: 'type',
    header: 'Type',
    render: value => <div className="flex items-center gap-2">
              <FileTextIcon size={16} className="text-blue-500" />
              {value}
            </div>
  }, {
    key: 'status',
    header: 'Status',
    render: value => <StatusBadge status={value} />
  }, {
    key: 'premium',
    header: 'Premium'
  }, {
    key: 'carrier',
    header: 'Carrier'
  }, {
    key: 'effectiveDate',
    header: 'Effective Date'
  }, {
    key: 'policyNumber',
    header: 'Policy Number'
  }]} filters={[{
    field: 'status',
    options: [{
      label: 'All Statuses',
      value: 'all'
    }, {
      label: 'Active',
      value: 'Active'
    }, {
      label: 'Pending',
      value: 'Pending'
    }, {
      label: 'Cancelled',
      value: 'Cancelled'
    }, {
      label: 'Expired',
      value: 'Expired'
    }]
  }]} searchFields={['company', 'type', 'policyNumber']} onRowClick={item => onPolicyClick(item.id)} />;
};