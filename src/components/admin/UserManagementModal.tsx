import React, { useState } from 'react';
import { UserIcon, SearchIcon, PlusIcon, XIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface UserManagementModalProps {
  role: {
    id: number;
    name: string;
  };
  assignedUsers: User[];
  availableUsers: User[];
  onClose: () => void;
  onUpdateUsers: (users: User[]) => void;
}
export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  role,
  assignedUsers,
  availableUsers,
  onClose,
  onUpdateUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>(assignedUsers);
  const filteredAvailableUsers = availableUsers.filter(user => !selectedUsers.find(selected => selected.id === user.id) && (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())));
  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
  };
  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };
  const handleSave = () => {
    onUpdateUsers(selectedUsers);
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
            <p className="text-sm text-gray-600">
              Manage users assigned to the {role.name} role
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <SearchIcon size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Available Users
              </h3>
              <div className="border border-gray-200 rounded-md h-80 overflow-y-auto">
                {filteredAvailableUsers.length === 0 ? <div className="flex items-center justify-center h-full text-gray-500">
                    No users found
                  </div> : <ul className="divide-y divide-gray-200">
                    {filteredAvailableUsers.map(user => <li key={user.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon size={16} className="text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => handleAddUser(user)} className="text-blue-600 hover:text-blue-800">
                          <PlusIcon size={16} />
                        </button>
                      </li>)}
                  </ul>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Assigned Users
              </h3>
              <div className="border border-gray-200 rounded-md h-80 overflow-y-auto">
                {selectedUsers.length === 0 ? <div className="flex items-center justify-center h-full text-gray-500">
                    No users assigned
                  </div> : <ul className="divide-y divide-gray-200">
                    {selectedUsers.map(user => <li key={user.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon size={16} className="text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveUser(user.id)} className="text-red-600 hover:text-red-800">
                          <XIcon size={16} />
                        </button>
                      </li>)}
                  </ul>}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>;
};