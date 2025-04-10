import React, { useState, useRef } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShieldIcon, PlusIcon, CheckIcon, XIcon, MoreVerticalIcon, UsersIcon } from 'lucide-react';
import { RoleDetails } from './RoleDetails';
import { UserManagementModal } from './UserManagementModal';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  dateCreated: string;
}
const mockRoles: Role[] = [{
  id: 1,
  name: 'Admin',
  description: 'Full system access',
  usersCount: 3,
  permissions: ['all'],
  dateCreated: '2023-01-01'
}, {
  id: 2,
  name: 'Manager',
  description: 'Department management access',
  usersCount: 8,
  permissions: ['read', 'write', 'manage_users'],
  dateCreated: '2023-01-15'
}, {
  id: 3,
  name: 'User',
  description: 'Basic system access',
  usersCount: 24,
  permissions: ['read', 'write'],
  dateCreated: '2023-01-15'
}, {
  id: 4,
  name: 'Viewer',
  description: 'Read-only access',
  usersCount: 12,
  permissions: ['read'],
  dateCreated: '2023-02-01'
}];
const mockAllUsers = [{
  id: 1,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'Admin'
}, {
  id: 2,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'User'
}, {
  id: 3,
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  role: 'Manager'
}];
export const RoleManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeRoleForUsers, setActiveRoleForUsers] = useState<Role | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setShowDropdown(null));
  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
  };
  const handleRoleSave = (updatedRole: Role) => {
    setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
    setSelectedRole(null);
  };
  const handleManageUsers = (role: Role) => {
    setActiveRoleForUsers(role);
    setShowUserManagement(true);
    setShowDropdown(null);
  };
  const handleUpdateUsers = (users: typeof mockAllUsers) => {
    if (activeRoleForUsers) {
      setRoles(roles.map(role => role.id === activeRoleForUsers.id ? {
        ...role,
        usersCount: users.length
      } : role));
    }
  };
  return <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Roles & Permissions
            </h1>
            <p className="text-gray-600">
              Manage user roles and their permissions
            </p>
          </div>
          <Button variant="primary" icon={PlusIcon} onClick={() => {}}>
            New Role
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Role List</h2>
            <Table data={roles} columns={[{
            key: 'name',
            header: 'Role Name',
            render: (_, role) => <div className="flex items-center gap-3">
                      <ShieldIcon size={16} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{role.name}</p>
                        <p className="text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>
                    </div>
          }, {
            key: 'usersCount',
            header: 'Users',
            render: value => <Badge variant="default">{value} users</Badge>
          }, {
            key: 'actions',
            header: '',
            render: (_, role) => <div className="relative" ref={dropdownRef}>
                      <button onClick={e => {
                e.stopPropagation();
                setShowDropdown(showDropdown === role.id ? null : role.id);
              }} className="text-gray-400 hover:text-gray-600">
                        <MoreVerticalIcon size={16} />
                      </button>
                      {showDropdown === role.id && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button onClick={e => {
                    e.stopPropagation();
                    handleManageUsers(role);
                  }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              <UsersIcon size={16} className="mr-2" />
                              Manage Users
                            </button>
                          </div>
                        </div>}
                    </div>
          }]} onRowClick={handleRoleClick} />
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Permission Matrix</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Permission
                    </th>
                    {roles.map(role => <th key={role.id} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        {role.name}
                      </th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {['View Dashboard', 'Manage Users', 'Manage Roles', 'View Reports', 'Edit Settings'].map((permission, index) => <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {permission}
                      </td>
                      {roles.map(role => <td key={role.id} className="px-4 py-2 text-center">
                          {role.name === 'Admin' || index < 2 && role.name === 'Manager' ? <CheckIcon size={16} className="text-green-600 mx-auto" /> : <XIcon size={16} className="text-gray-400 mx-auto" />}
                        </td>)}
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      {selectedRole && <RoleDetails role={selectedRole} onClose={() => setSelectedRole(null)} onSave={handleRoleSave} />}
      {showUserManagement && activeRoleForUsers && <UserManagementModal role={activeRoleForUsers} assignedUsers={mockAllUsers.slice(0, activeRoleForUsers.usersCount)} availableUsers={mockAllUsers} onClose={() => {
      setShowUserManagement(false);
      setActiveRoleForUsers(null);
    }} onUpdateUsers={handleUpdateUsers} />}
    </div>;
};