import React from 'react';
import { BotIcon, UserIcon } from 'lucide-react';
import { TaskSuggestion } from './TaskSuggestion';
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ultron';
  timestamp: Date;
  type?: 'task_suggestion' | 'regular';
  onTaskConfirm?: (createTask: boolean) => void;
}
interface ChatMessageProps {
  message: Message;
}
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message
}) => {
  const isUltron = message.sender === 'ultron';
  return <div className={`flex items-start gap-3 mb-4 ${isUltron ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUltron ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {isUltron ? <BotIcon size={16} className="text-blue-600" /> : <UserIcon size={16} className="text-gray-600" />}
      </div>
      <div className={`max-w-[80%] ${isUltron ? 'mr-12' : 'ml-12'}`}>
        {message.type === 'task_suggestion' ? <TaskSuggestion message={message.text} onConfirm={message.onTaskConfirm || (() => {})} /> : <div className={`rounded-lg px-4 py-2 ${isUltron ? 'bg-blue-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
            <p className="text-sm">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
            </p>
          </div>}
      </div>
    </div>;
};