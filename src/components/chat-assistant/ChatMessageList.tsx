
import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/utils/perplexityService';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-center text-sm">
          Comment puis-je vous aider aujourd'hui?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
        <ChatMessage
          key={index}
          content={msg.content}
          isUser={msg.role === 'user'}
        />
      ))}
      {isLoading && (
        <div className="bg-directiveplus-50 mr-4 rounded-xl rounded-br-none p-3">
          <p className="text-sm">En train d'écrire...</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
