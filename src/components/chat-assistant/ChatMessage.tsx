
import { ReactNode } from 'react';
import { LinkIcon } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

// Function to format message content to highlight references
export const formatMessageContent = (content: string): ReactNode => {
  // Check if the content has references section
  const hasReferences = content.includes("Références:") || 
                        content.includes("Sources:") || 
                        content.includes("Références :") || 
                        content.includes("Sources :");
  
  if (!hasReferences) return content;
  
  // Split the content into main text and references
  let mainText, references;
  
  if (content.includes("Références:")) {
    [mainText, references] = content.split("Références:");
  } else if (content.includes("Références :")) {
    [mainText, references] = content.split("Références :");
  } else if (content.includes("Sources:")) {
    [mainText, references] = content.split("Sources:");
  } else {
    [mainText, references] = content.split("Sources :");
  }
  
  return (
    <>
      <div>{mainText}</div>
      {references && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center text-xs font-medium text-gray-500 mb-1">
            <LinkIcon className="h-3 w-3 mr-1" />
            Références:
          </div>
          <div className="text-xs text-gray-600">{references}</div>
        </div>
      )}
    </>
  );
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
      {isUser ? (
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      ) : (
        <div className="text-sm whitespace-pre-wrap">
          {formatMessageContent(content)}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
