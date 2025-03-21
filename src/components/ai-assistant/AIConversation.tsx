
import React from 'react';

interface AIConversationProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export function AIConversation({ messages }: AIConversationProps) {
  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg ${
            message.role === 'assistant' 
              ? 'bg-primary/10 mr-8' 
              : 'bg-primary text-white ml-8'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
