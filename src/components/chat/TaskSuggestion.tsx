import React from 'react';
import { CheckSquareIcon } from 'lucide-react';
interface TaskSuggestionProps {
  message: string;
  onConfirm: (createTask: boolean) => void;
}
export const TaskSuggestion: React.FC<TaskSuggestionProps> = ({
  message,
  onConfirm
}) => {
  return <div className="bg-blue-50 p-4 rounded-lg">
      <p className="text-sm text-gray-800 mb-3">{message}</p>
      <p className="text-sm font-medium text-gray-700 mb-2">
        Would you like me to create a task for this?
      </p>
      <div className="flex gap-3">
        <button onClick={() => onConfirm(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          <CheckSquareIcon size={16} />
          Yes, create task
        </button>
        <button onClick={() => onConfirm(false)} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
          No, thanks
        </button>
      </div>
    </div>;
};