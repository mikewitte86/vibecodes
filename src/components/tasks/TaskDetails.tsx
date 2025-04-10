import React, { useState } from 'react';
import { XIcon, CalendarIcon, UserIcon, ClockIcon, AlertCircleIcon, CheckCircleIcon, TagIcon, FileTextIcon } from 'lucide-react';
interface Task {
  id: number;
  title: string;
  description: string;
  type: 'Renewal' | 'Servicing' | 'Data Entry' | 'Quote';
  status: 'Open' | 'Assigned' | 'Completed' | 'Audited';
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdBy: 'Ultron' | 'Human';
}
interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}
export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onClose,
  onSave
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
    setIsEditing(false);
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-gray-100 text-gray-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Audited':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        {isEditing ? <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input type="text" name="title" value={editedTask.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea name="description" value={editedTask.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select name="type" value={editedTask.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Renewal">Renewal</option>
                    <option value="Servicing">Servicing</option>
                    <option value="Data Entry">Data Entry</option>
                    <option value="Quote">Quote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select name="status" value={editedTask.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Completed">Completed</option>
                    <option value="Audited">Audited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select name="priority" value={editedTask.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input type="text" name="assignee" value={editedTask.assignee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input type="date" name="dueDate" value={editedTask.dueDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </form> : <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="prose max-w-none text-gray-600 mb-6">
                {task.description}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">{task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Assignee</p>
                      <p className="font-medium">
                        {task.assignee || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TagIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{task.type}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FileTextIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Created By</p>
                      <p className="font-medium">{task.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertCircleIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Priority Level</p>
                      <p className="font-medium">{task.priority}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium">{task.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-end">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Task
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};