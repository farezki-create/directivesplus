
import { ReactNode } from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

// Fonction simplifiée qui ne formate plus les références
export const formatMessageContent = (content: string): ReactNode => {
  // On supprime toutes les références
  let mainText = content;
  
  if (content.includes("Références:")) {
    mainText = content.split("Références:")[0];
  } else if (content.includes("Références :")) {
    mainText = content.split("Références :")[0];
  } else if (content.includes("Sources:")) {
    mainText = content.split("Sources:")[0];
  } else if (content.includes("Sources :")) {
    mainText = content.split("Sources :")[0];
  }
  
  return mainText;
};

const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <div
      className={`${
        isUser
          ? 'bg-gray-100 ml-4 rounded-bl-none'
          : 'bg-directiveplus-50 mr-4 rounded-br-none'
      } p-3 rounded-xl`}
    >
      <p className="text-sm whitespace-pre-wrap">
        {isUser ? content : formatMessageContent(content)}
      </p>
    </div>
  );
};

export default ChatMessage;
