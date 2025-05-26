
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/social";
import { toast } from "@/hooks/use-toast";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            id,
            user_id,
            conversation_id,
            joined_at
          ),
          messages (
            content,
            created_at,
            user_id
          )
        `)
        .eq('conversation_participants.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const conversationsWithLastMessage = data?.map(conv => ({
        ...conv,
        participants: conv.conversation_participants?.map(participant => ({
          id: participant.id,
          conversation_id: participant.conversation_id,
          user_id: participant.user_id,
          joined_at: participant.joined_at,
          user_profile: {
            first_name: 'Utilisateur',
            last_name: ''
          }
        })) || [],
        last_message: conv.messages && conv.messages.length > 0 ? {
          id: 'temp-id',
          conversation_id: conv.id,
          user_id: conv.messages[0].user_id,
          content: conv.messages[0].content,
          message_type: 'text' as const,
          created_at: conv.messages[0].created_at,
          updated_at: conv.messages[0].created_at,
          is_read: false
        } : null
      })) || [];

      setConversations(conversationsWithLastMessage);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (participantUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Créer la conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      // Ajouter les participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: participantUserId }
        ]);

      if (participantsError) throw participantsError;

      fetchConversations();
      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    createConversation,
    refreshConversations: fetchConversations
  };
};
