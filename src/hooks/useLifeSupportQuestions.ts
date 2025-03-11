
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useLifeSupportQuestions(isDialogOpen: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      if (!isDialogOpen) return;
      
      try {
        setLoading(true);
        console.log(`[LifeSupport] Fetching questions in language: ${currentLanguage}`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions - using simple select with no RLS constraints
          console.log(`[LifeSupport] Fetching from table: questionnaire_life_support_en`);
          const { data, error } = await supabase
            .from('questionnaire_life_support_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching English questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] English questions loaded:', data?.length || 0);
          console.log('[LifeSupport] Raw English data sample:', data?.[0] || 'No data');
          
          if (!data || data.length === 0) {
            console.warn('[LifeSupport] No English questions found in the database.');
            setQuestions([]);
            setLoading(false);
            return;
          }
          
          // Ensure options are properly formatted
          const formattedData = data.map(item => ({
            id: item.id || `en-${item.display_order}`,
            question: item.question || '',
            question_text: item.question || '', // Ensure both fields exist
            display_order: item.display_order,
            options: {
              yes: "Yes",
              no: "No",
              unsure: "I'm not sure"
            }
          }));
          
          console.log('[LifeSupport] Formatted English questions count:', formattedData.length);
          setQuestions(formattedData);
        } else {
          // Fetch French questions - using simple select with no RLS constraints
          console.log(`[LifeSupport] Fetching from table: questionnaire_life_support_fr`);
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*')
            .order('question_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching French questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] Raw French data sample:', data?.[0] || 'No data');
          console.log('[LifeSupport] French questions count:', data?.length || 0);
          
          if (!data || data.length === 0) {
            console.warn('[LifeSupport] No French questions found in the database.');
            setQuestions([]);
            setLoading(false);
            return;
          }
          
          // Transform French questions to match expected format
          const formattedData = data.map(item => ({
            id: item.id?.toString() || `fr-${item.question_order}`,
            question_text: item.question_text || '',
            question: item.question_text || '', // Ensure both fields exist
            question_order: item.question_order,
            display_order: item.question_order, // Add display_order for consistency
            options: {
              yes: item.option_yes || "Oui",
              no: item.option_no || "Non",
              unsure: item.option_unsure || "Je ne suis pas sûr(e)"
            }
          }));
          
          console.log('[LifeSupport] Formatted French questions count:', formattedData.length);
          setQuestions(formattedData);
        }
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred." 
            : "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    if (isDialogOpen) {
      fetchQuestions();
    } else {
      // Reset questions when dialog is closed
      setQuestions([]);
      setLoading(true);
    }
  }, [isDialogOpen, toast, currentLanguage, t]);

  return { questions, loading };
}
