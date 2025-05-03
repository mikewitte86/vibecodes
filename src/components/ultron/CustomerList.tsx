import React, { useState, useEffect } from 'react';
import { Table } from '../common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useApiClient, clearRequestCache } from '../../services/ApiService';
import { RefreshCwIcon } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  status: string;
}

interface Column<T> {
  key: keyof T;
  header: string;
  sortable: boolean;
  render?: (value: any) => React.ReactNode;
}

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const apiClient = useApiClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching customers using ApiService...");
      
      const response = await apiClient.fetchCustomers();
      console.log('Customers data:', response);
      
      // Extract customers from the nested response structure
      const customersList = response.body?.customers || [];
      
      setCustomers(customersList.map((customer: {
        id: string;
        name?: string;
        commercial_name?: string;
        status?: string;
      }) => ({
        id: customer.id,
        name: customer.commercial_name || customer.name || 'Unknown',
        status: customer.status || 'UNKNOWN'
      })));
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(`Failed to load customers: ${err instanceof Error ? err.message : String(err)}`);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Clear the specific cache for platform customers
    clearRequestCache('platform-customers-list');
    // Fetch fresh data
    fetchCustomers();
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'status') {
      return sortDirection === 'asc' 
        ? a.status.localeCompare(b.status) 
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600">View and manage all customers from Ultron.</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isLoading}
          className={`flex items-center px-3 py-2 rounded ${
            isLoading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
          title="Refresh customer data"
        >
          <RefreshCwIcon size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          <p className="mb-2">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading customers...
          </div>
        ) : customers.length === 0 && !error ? (
          <div className="p-8 text-center text-gray-500">
            No customers found
          </div>
        ) : (
          <Table 
            data={sortedCustomers} 
            columns={columns} 
            sortField={sortField} 
            sortDirection={sortDirection} 
            onSort={handleSort}
            onRowClick={(customer) => onSelectCustomer(customer)}
          />
        )}
      </div>
    </div>
  );
}; 