
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdvancedIllnessQuestions(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("[AdvancedIllness] Fetching questions...");
        const { data, error } = await supabase
          .from('advanced_illness_questions')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('[AdvancedIllness] Error fetching questions:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
        const sortedQuestions = data?.sort((a, b) => {
          if (a.display_order === null) return 1;
          if (b.display_order === null) return -1;
          return a.display_order - b.display_order;
        }) || [];
        
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('[AdvancedIllness] Unexpected error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open, toast]);

  return { questions, loading };
}
