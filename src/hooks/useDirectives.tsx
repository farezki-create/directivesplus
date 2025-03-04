
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DirectiveContent {
  general: any[];
  lifeSupport: any[];
  advancedIllness: any[];
  preferences: any[];
  profile: any;
  trustedPersons: any[];
}

interface Directive {
  id: string;
  user_id: string;
  content: DirectiveContent;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export function useDirectives(userId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: directive,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["directives", userId],
    queryFn: async () => {
      console.log("[Directives] Fetching active directive for user:", userId);
      const { data, error } = await supabase
        .from("directives")
        .select()
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("[Directives] Error fetching directive:", error);
        return null;
      }
      
      console.log("[Directives] Retrieved directive:", data);
      return data as unknown as Directive | null;
    },
    enabled: !!userId,
  });

  const saveDirective = useMutation({
    mutationFn: async (content: DirectiveContent) => {
      try {
        console.log("[Directives] Saving directive for user:", userId);
        
        // First, check if there are existing directives for this user
        const { data: existingDirectives, error: checkError } = await supabase
          .from("directives")
          .select("id")
          .eq("user_id", userId);
        
        if (checkError) {
          console.error("[Directives] Error checking existing directives:", checkError);
          throw checkError;
        }

        // If there are existing directives, update them all to inactive
        if (existingDirectives && existingDirectives.length > 0) {
          console.log("[Directives] Deactivating existing directives");
          const { error: updateError } = await supabase
            .from("directives")
            .update({ is_active: false })
            .eq("user_id", userId);

          if (updateError) {
            console.error("[Directives] Error deactivating old directives:", updateError);
            throw updateError;
          }
        }

        // Then, insert the new directive
        console.log("[Directives] Inserting new directive");
        const { data, error } = await supabase
          .from("directives")
          .insert([
            {
              user_id: userId,
              content: content as any,
              is_active: true,
            },
          ])
          .select()
          .maybeSingle();

        if (error) {
          console.error("[Directives] Error saving directive:", error);
          throw error;
        }

        console.log("[Directives] Successfully saved directive:", data);
        return data as unknown as Directive;
      } catch (error) {
        console.error("[Directives] Error in saveDirective mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Vos directives ont été enregistrées.",
      });
      queryClient.invalidateQueries({ queryKey: ["directives", userId] });
    },
    onError: (error) => {
      console.error("[Directives] Mutation error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos directives.",
        variant: "destructive",
      });
    },
  });

  return {
    directive,
    isLoading,
    error,
    saveDirective,
  };
}
