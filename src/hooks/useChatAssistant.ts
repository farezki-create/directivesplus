
import { useState } from 'react';
import { ChatMessage, sendChatMessage, getPerplexityApiKey } from '@/utils/perplexityService';
import { toast } from '@/hooks/use-toast';

export const useChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
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

  const hasApiKey = getPerplexityApiKey() !== null;

  return {
    messages,
    isLoading,
    hasApiKey,
    handleSendMessage
  };
};
