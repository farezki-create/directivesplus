
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X } from 'lucide-react';
import ChatContainer from './chat-assistant/ChatContainer';

interface ChatAssistantProps {
  onClose?: () => void;
}

const ChatAssistant = ({ onClose }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 bg-directiveplus-600 hover:bg-directiveplus-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-xl">
          <CardHeader className="bg-directiveplus-600 text-white py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Assistant DirectivesPlus
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 text-white hover:bg-directiveplus-500">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <ChatContainer />
        </Card>
      )}
    </div>
  );
};

export default ChatAssistant;
