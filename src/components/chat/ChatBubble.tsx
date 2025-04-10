import React, { useState } from 'react';
import { BotIcon, XIcon } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
export const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50">
        {isOpen ? <XIcon size={24} /> : <BotIcon size={24} />}
      </button>
      {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
    </>;
};