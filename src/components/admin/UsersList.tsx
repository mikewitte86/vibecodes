import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { SearchInput } from '../common/SearchInput';
import { Button } from '../common/Button';
import { UserDetails } from './UserDetails';
import { NewUserModal } from './NewUserModal';
import { UserIcon, PlusIcon, MoreVerticalIcon, ShieldIcon, ClockIcon } from 'lucide-react';
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  dateCreated: string;
}
const mockUsers: User[] = [{
  id: 1,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'Admin',
  status: 'Active',
  lastActive: '2023-09-14 10:30 AM',
  dateCreated: '2023-01-15'
}, {
  id: 2,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'User',
  status: 'Active',
  lastActive: '2023-09-14 09:15 AM',
  dateCreated: '2023-02-20'
}, {
  id: 3,
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  role: 'Manager',
  status: 'Active',
  lastActive: '2023-09-13 05:45 PM',
  dateCreated: '2023-03-10'
}, {
  id: 4,
  name: 'Mike Wilson',
  email: 'mike.w@example.com',
  role: 'User',
  status: 'Inactive',
  lastActive: '2023-09-10 11:20 AM',
  dateCreated: '2023-04-05'
}, {
  id: 5,
  name: 'Emily Brown',
  email: 'emily.b@example.com',
  role: 'User',
  status: 'Pending',
  lastActive: 'Never',
  dateCreated: '2023-09-13'
}];
export const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };
  const handleUserSave = (updatedUser: User) => {
    setSelectedUser(null);
  };
  const handleNewUser = (newUser: {
    name: string;
    email: string;
    role: string;
    status: string;
  }) => {
    setIsNewUserModalOpen(false);
  };
  return <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage system users and their access
            </p>
          </div>
          <Button variant="primary" icon={PlusIcon} onClick={() => setIsNewUserModalOpen(true)}>
            New User
          </Button>
        </div>
      </div>
      <Card>
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search users..." />
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md px-3 py-2" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <Table data={filteredUsers} columns={[{
        key: 'name',
        header: 'Name',
        render: (_, user) => <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
      }, {
        key: 'role',
        header: 'Role',
        render: value => <Badge variant="info">{value}</Badge>
      }, {
        key: 'status',
        header: 'Status',
        render: value => <Badge variant={getStatusColor(value as string)}>{value}</Badge>
      }, {
        key: 'lastActive',
        header: 'Last Active',
        render: value => <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ClockIcon size={14} />
                  <span>{value}</span>
                </div>
      }, {
        key: 'actions',
        header: '',
        render: () => <button className="text-gray-400 hover:text-gray-600">
                  <MoreVerticalIcon size={16} />
                </button>
      }]} onRowClick={handleUserClick} />
      </Card>
      {selectedUser && <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} onSave={handleUserSave} />}
      {isNewUserModalOpen && <NewUserModal onClose={() => setIsNewUserModalOpen(false)} onSave={handleNewUser} />}
    </div>;
};