import React, { useState } from 'react';
import { XIcon, ShieldIcon } from 'lucide-react';
interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  dateCreated: string;
}
interface RoleDetailsProps {
  role: Role;
  onClose: () => void;
  onSave: (updatedRole: Role) => void;
}
export const RoleDetails: React.FC<RoleDetailsProps> = ({
  role,
  onClose,
  onSave
}) => {
  const [editedRole, setEditedRole] = useState<Role>(role);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditedRole(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRole);
    setIsEditing(false);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Role Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        {isEditing ? <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input type="text" name="name" value={editedRole.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea name="description" value={editedRole.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {['View Dashboard', 'Manage Users', 'Manage Roles', 'View Reports', 'Edit Settings'].map(permission => <label key={permission} className="flex items-center space-x-2">
                      <input type="checkbox" checked={editedRole.permissions.includes(permission.toLowerCase().replace(' ', '_'))} onChange={e => {
                  const perm = permission.toLowerCase().replace(' ', '_');
                  setEditedRole(prev => ({
                    ...prev,
                    permissions: e.target.checked ? [...prev.permissions, perm] : prev.permissions.filter(p => p !== perm)
                  }));
                }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">
                        {permission}
                      </span>
                    </label>)}
                </div>
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
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShieldIcon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {role.name}
                  </h3>
                  <p className="text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Role Statistics
                  </h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Users Assigned</dt>
                      <dd className="text-sm font-medium">{role.usersCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Created On</dt>
                      <dd className="text-sm font-medium">
                        {role.dateCreated}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </h4>
                  <ul className="space-y-1">
                    {role.permissions.map(permission => <li key={permission} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>
                          {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-end">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Role
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};