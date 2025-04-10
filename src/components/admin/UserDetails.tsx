import React, { useState } from 'react';
import { XIcon, UserIcon, MailIcon, CalendarIcon, ShieldIcon } from 'lucide-react';
import { Badge } from '../common/Badge';
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  dateCreated: string;
}
interface UserDetailsProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}
export const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onClose,
  onSave
}) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
    setIsEditing(false);
  };
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
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        {isEditing ? <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input type="text" name="name" value={editedUser.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select name="role" value={editedUser.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select name="status" value={editedUser.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </form> : <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ShieldIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{user.dateCreated}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Last Active</p>
                      <p className="font-medium">{user.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-end">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit User
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};