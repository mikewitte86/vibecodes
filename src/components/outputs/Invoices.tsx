import React, { useState } from 'react';
import { Card } from '../common/Card';
import { SearchIcon, FilterIcon, DollarSignIcon, AlertCircleIcon, ExternalLinkIcon, ClockIcon } from 'lucide-react';
interface Invoice {
  id: string;
  company: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  daysOutstanding: number;
  ascendLink: string;
}
const mockInvoices: Invoice[] = [{
  id: 'INV-001',
  company: 'Acme Corporation',
  amount: '$12,500',
  issueDate: '2023-08-01',
  dueDate: '2023-09-01',
  status: 'Paid',
  daysOutstanding: 0,
  ascendLink: '#'
}, {
  id: 'INV-002',
  company: 'TechCorp Industries',
  amount: '$8,200',
  issueDate: '2023-08-05',
  dueDate: '2023-09-05',
  status: 'Pending',
  daysOutstanding: 3,
  ascendLink: '#'
}, {
  id: 'INV-003',
  company: 'Global Manufacturing',
  amount: '$15,750',
  issueDate: '2023-07-15',
  dueDate: '2023-08-15',
  status: 'Overdue',
  daysOutstanding: 18,
  ascendLink: '#'
}, {
  id: 'INV-004',
  company: 'Stellar Services',
  amount: '$9,300',
  issueDate: '2023-08-10',
  dueDate: '2023-09-10',
  status: 'Pending',
  daysOutstanding: 8,
  ascendLink: '#'
}, {
  id: 'INV-005',
  company: 'Innovative Solutions',
  amount: '$6,800',
  issueDate: '2023-07-20',
  dueDate: '2023-08-20',
  status: 'Overdue',
  daysOutstanding: 13,
  ascendLink: '#'
}, {
  id: 'INV-006',
  company: 'Premier Products',
  amount: '$11,200',
  issueDate: '2023-08-15',
  dueDate: '2023-09-15',
  status: 'Pending',
  daysOutstanding: 13,
  ascendLink: '#'
}, {
  id: 'INV-007',
  company: 'Elite Enterprises',
  amount: '$18,500',
  issueDate: '2023-07-25',
  dueDate: '2023-08-25',
  status: 'Overdue',
  daysOutstanding: 8,
  ascendLink: '#'
}, {
  id: 'INV-008',
  company: 'Dynamic Designs',
  amount: '$7,900',
  issueDate: '2023-08-20',
  dueDate: '2023-09-20',
  status: 'Pending',
  daysOutstanding: 18,
  ascendLink: '#'
}];
export const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filteredInvoices = mockInvoices.filter(invoice => invoice.company.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.id.toLowerCase().includes(searchTerm.toLowerCase())).filter(invoice => statusFilter === 'all' || invoice.status === statusFilter);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <p className="text-gray-600">Manage and track invoice status</p>
      </div>
      <Card title="Invoice Management">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <input type="text" placeholder="Search invoices..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon size={18} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FilterIcon size={18} className="text-gray-400" />
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Outstanding
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map(invoice => <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.issueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${invoice.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {invoice.daysOutstanding > 0 ? `${invoice.daysOutstanding} days` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href={invoice.ascendLink} className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1">
                      <span>View in Ascend</span>
                      <ExternalLinkIcon size={14} />
                    </a>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
};