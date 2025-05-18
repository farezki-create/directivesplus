
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X, Link as LinkIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { setPerplexityApiKey, getPerplexityApiKey, sendChatMessage, ChatMessage } from '@/utils/perplexityService';

interface ChatAssistantProps {
  onClose?: () => void;
}

const ChatAssistant = ({ onClose }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for existing API key in session
    const existingKey = getPerplexityApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Clé API requise",
        description: "Veuillez entrer votre clé API Perplexity",
        variant: "destructive"
      });
      return;
    }

    setPerplexityApiKey(apiKey);
    toast({
      title: "Clé API sauvegardée",
      description: "Votre clé API a été enregistrée pour cette session"
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Add system message if this is the first message
      const systemMessage: ChatMessage = { 
        role: 'system', 
        content: 'Vous êtes un assistant pour DirectivesPlus, une plateforme de gestion des directives anticipées médicales. ' +
                'Répondez de façon utile, précise et concise. Incluez TOUJOURS des références à la fin de votre réponse sous forme d\'une liste de sources. Répondez en français.'
      };
      
      const allMessages: ChatMessage[] = messages.length === 0 
        ? [systemMessage, userMessage]
        : [...messages, userMessage];
      
      const response = await sendChatMessage({
        messages: allMessages,
        temperature: 0.2
      });
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'envoi du message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Function to format message content to highlight references
  const formatMessageContent = (content: string) => {
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
          
          <CardContent className="p-0">
            {!getPerplexityApiKey() ? (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Pour utiliser l'assistant, veuillez entrer votre clé API Perplexity.
                </p>
                <Input
                  type="password"
                  placeholder="Clé API Perplexity"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleSaveApiKey}
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                >
                  Enregistrer la clé
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Vous pouvez obtenir une clé API sur{' '}
                  <a 
                    href="https://www.perplexity.ai/settings/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-directiveplus-600 hover:underline"
                  >
                    perplexity.ai
                  </a>
                </p>
              </div>
            ) : (
              <>
                <div className="h-64 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p className="text-center text-sm">
                        Comment puis-je vous aider aujourd'hui?
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
                        <div
                          key={index}
                          className={`${
                            msg.role === 'user'
                              ? 'bg-gray-100 ml-4 rounded-bl-none'
                              : 'bg-directiveplus-50 mr-4 rounded-br-none'
                          } p-3 rounded-xl`}
                        >
                          {msg.role === 'user' ? (
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="text-sm whitespace-pre-wrap">
                              {formatMessageContent(msg.content)}
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="bg-directiveplus-50 mr-4 rounded-xl rounded-br-none p-3">
                          <p className="text-sm">En train d'écrire...</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                <div className="border-t p-3">
                  <div className="flex">
                    <Textarea
                      placeholder="Écrivez votre message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[40px] max-h-32 rounded-r-none border-r-0 resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="rounded-l-none bg-directiveplus-600 hover:bg-directiveplus-700"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatAssistant;
