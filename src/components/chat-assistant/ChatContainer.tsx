
import { useChatAssistant } from '@/hooks/useChatAssistant';
import { CardContent } from '@/components/ui/card';
import ChatApiKeyForm from './ChatApiKeyForm';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const { messages, isLoading, hasApiKey, handleSendMessage } = useChatAssistant();

  return (
    <CardContent className="p-0">
      {!hasApiKey ? (
        <ChatApiKeyForm />
      ) : (
        <>
          <div className="h-64 overflow-y-auto p-4">
            <ChatMessageList messages={messages} isLoading={isLoading} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      )}
    </CardContent>
  );
};

export default ChatContainer;
