import React, { useEffect, useState, useRef } from 'react';
import { XIcon, SendIcon } from 'lucide-react';
import { ChatMessage, Message } from './ChatMessage';
interface ChatPanelProps {
  onClose: () => void;
}
export const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm Ultron, your AI processing assistant. How can I help you today?",
    sender: 'ultron',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'regular'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    // Simulate Ultron's response with task suggestion
    setTimeout(() => {
      const suggestionMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand you need help with this. I can assist you with processing this request.',
        sender: 'ultron',
        timestamp: new Date(),
        type: 'task_suggestion',
        onTaskConfirm: createTask => {
          if (createTask) {
            const confirmationMessage: Message = {
              id: Date.now().toString(),
              text: "I've created a task to handle this request. You can track its progress on the Task Board.",
              sender: 'ultron',
              timestamp: new Date(),
              type: 'regular'
            };
            setMessages(prev => [...prev, confirmationMessage]);
          } else {
            const declineMessage: Message = {
              id: Date.now().toString(),
              text: 'No problem. Let me know if you need anything else!',
              sender: 'ultron',
              timestamp: new Date(),
              type: 'regular'
            };
            setMessages(prev => [...prev, declineMessage]);
          }
        }
      };
      setMessages(prev => [...prev, suggestionMessage]);
    }, 1000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-blue-600 font-bold">U</span>
          </div>
          <div>
            <h3 className="font-medium text-white">Ultron</h3>
            <p className="text-xs text-blue-100">AI Processing Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
          <XIcon size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => <ChatMessage key={message.id} message={message} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" rows={2} />
          <button onClick={handleSend} disabled={!input.trim()} className={`absolute right-2 bottom-2 p-1 rounded-full ${input.trim() ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400'}`}>
            <SendIcon size={20} />
          </button>
        </div>
      </div>
    </div>;
};