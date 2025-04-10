import React, { useState } from 'react';
import { Card } from '../common/Card';
import { mockTasks } from '../data/mockData';
import { SearchIcon, FilterIcon, PlusIcon, UsersIcon, CalendarIcon, CheckIcon, ClipboardIcon, RotateCwIcon, AlertCircleIcon, CheckSquareIcon } from 'lucide-react';
import { TaskDetails } from './TaskDetails';
import { MetricTable } from '../common/MetricTable';
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
interface TaskBoardProps {
  initialFilter: {
    status: string;
    priority: string;
  };
}
export const TaskBoard: React.FC<TaskBoardProps> = ({
  initialFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter.status);
  const [priorityFilter, setPriorityFilter] = useState<string>(initialFilter.priority);
  const [creatorFilter, setCreatorFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'Servicing',
    dueDate: '',
    priority: 'Medium',
    assignee: ''
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const handleCardClick = (status: string | null, priority: string | null) => {
    if (status) {
      setStatusFilter(status);
      setPriorityFilter('all');
    }
    if (priority) {
      setPriorityFilter(priority);
      setStatusFilter('all');
    }
  };
  const filteredTasks = mockTasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase())).filter(task => typeFilter === 'all' || task.type === typeFilter).filter(task => statusFilter === 'all' || task.status === statusFilter).filter(task => priorityFilter === 'all' || task.priority === priorityFilter).filter(task => creatorFilter === 'all' || task.createdBy === creatorFilter);
  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleNewTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      type: 'Servicing',
      dueDate: '',
      priority: 'Medium',
      assignee: ''
    });
  };
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  const handleTaskSave = (updatedTask: Task) => {
    setSelectedTask(null);
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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <ClipboardIcon size={16} className="text-gray-600" />;
      case 'Assigned':
        return <UsersIcon size={16} className="text-blue-600" />;
      case 'Completed':
        return <CheckIcon size={16} className="text-green-600" />;
      case 'Audited':
        return <CheckSquareIcon size={16} className="text-purple-600" />;
      default:
        return null;
    }
  };
  return <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
          <p className="text-gray-600">
            Manage and track tasks from Ultron and team members.
          </p>
        </div>
        <button onClick={() => setIsNewTaskModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <PlusIcon size={16} className="mr-2" />
          New Task
        </button>
      </div>
      <div className="mb-6">
        <MetricTable items={[{
        title: 'Open Tasks',
        value: mockTasks.filter(task => task.status === 'Open').length,
        subtitle: 'Need assignment',
        icon: ClipboardIcon,
        onClick: () => handleCardClick('Open', null)
      }, {
        title: 'Assigned Tasks',
        value: mockTasks.filter(task => task.status === 'Assigned').length,
        subtitle: 'In progress',
        icon: UsersIcon,
        onClick: () => handleCardClick('Assigned', null)
      }, {
        title: 'Completed Tasks',
        value: mockTasks.filter(task => task.status === 'Completed').length,
        subtitle: 'Ready for audit',
        icon: CheckIcon,
        onClick: () => handleCardClick('Completed', null)
      }, {
        title: 'High Priority',
        value: mockTasks.filter(task => task.priority === 'High' || task.priority === 'Urgent').length,
        subtitle: 'Urgent attention',
        icon: AlertCircleIcon,
        onClick: () => handleCardClick(null, 'High')
      }]} />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <input type="text" placeholder="Search tasks..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={18} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                <FilterIcon size={18} className="text-gray-400 mr-2" />
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Servicing">Servicing</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Quote">Quote</option>
                </select>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Completed">Completed</option>
                <option value="Audited">Audited</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={creatorFilter} onChange={e => setCreatorFilter(e.target.value)}>
                <option value="all">All Creators</option>
                <option value="Ultron">Ultron</option>
                <option value="Human">Human</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">
                      {task.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {isNewTaskModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <form onSubmit={handleNewTaskSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input type="text" id="title" name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.title} onChange={handleNewTaskChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea id="description" name="description" required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.description} onChange={handleNewTaskChange}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Type *
                  </label>
                  <select id="type" name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.type} onChange={handleNewTaskChange}>
                    <option value="Renewal">Renewal</option>
                    <option value="Servicing">Servicing</option>
                    <option value="Data Entry">Data Entry</option>
                    <option value="Quote">Quote</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select id="priority" name="priority" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.priority} onChange={handleNewTaskChange}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input type="date" id="dueDate" name="dueDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.dueDate} onChange={handleNewTaskChange} />
                </div>
                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input type="text" id="assignee" name="assignee" placeholder="Leave blank for unassigned" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newTask.assignee} onChange={handleNewTaskChange} />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>}
      {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleTaskSave} />}
    </div>;
};