
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/social";
import { toast } from "@/hooks/use-toast";

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithUserData = data?.map(message => ({
        id: message.id,
        conversation_id: message.conversation_id,
        user_id: message.user_id,
        content: message.content,
        message_type: message.message_type as 'text' | 'image' | 'file',
        created_at: message.created_at,
        updated_at: message.updated_at,
        is_read: message.is_read,
        user_profile: {
          first_name: 'Utilisateur',
          last_name: ''
        }
      })) || [];

      setMessages(messagesWithUserData);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversationId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          content,
          message_type: 'text'
        });

      if (error) throw error;

      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      fetchMessages();
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};
