
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useAllQuestionnaires(isOpen: boolean) {
  const [generalQuestions, setGeneralQuestions] = useState<any[]>([]);
  const [lifeSupportQuestions, setLifeSupportQuestions] = useState<any[]>([]);
  const [advancedIllnessQuestions, setAdvancedIllnessQuestions] = useState<any[]>([]);
  const [preferencesQuestions, setPreferencesQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchAllQuestionnaires() {
      try {
        setLoading(true);
        console.log(`[AllQuestionnaires] Fetching all questionnaires in ${currentLanguage}...`);
        
        // Determine table names based on language
        const generalTable = currentLanguage === 'en' 
          ? 'questionnaire_general_en' 
          : 'questionnaire_general_fr';
          
        const lifeSupportTable = currentLanguage === 'en'
          ? 'questionnaire_life_support_en'
          : 'questionnaire_life_support_fr';
          
        const advancedIllnessTable = currentLanguage === 'en'
          ? 'questionnaire_advanced_illness_en'
          : 'questionnaire_advanced_illness_fr';
          
        const preferencesTable = currentLanguage === 'en'
          ? 'questionnaire_preferences_en'
          : 'questionnaire_preferences_fr';

        // Fetch general questions
        const { data: generalData, error: generalError } = await supabase
          .from(generalTable)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (generalError) {
          console.error('[AllQuestionnaires] Error fetching general questions:', generalError);
          throw generalError;
        }
        
        console.log('[AllQuestionnaires] General questions loaded:', generalData?.length);
        setGeneralQuestions(generalData || []);
        
        // Fetch life support questions
        const { data: lifeSupportData, error: lifeSupportError } = await supabase
          .from(lifeSupportTable)
          .select('*')
          .order(currentLanguage === 'en' ? 'display_order' : 'question_order', { ascending: true });
            
        if (lifeSupportError) {
          console.error('[AllQuestionnaires] Error fetching life support questions:', lifeSupportError);
          throw lifeSupportError;
        }
        
        // Process life support questions based on the table structure
        const processedLifeSupportData = currentLanguage === 'en' 
          ? lifeSupportData 
          : lifeSupportData?.map(item => ({
              id: item.id,
              question: item.question_text || item.question,
              display_order: item.question_order || item.display_order
            }));
        
        console.log('[AllQuestionnaires] Life support questions loaded:', processedLifeSupportData?.length);
        setLifeSupportQuestions(processedLifeSupportData || []);
        
        // Fetch advanced illness questions
        const { data: advancedData, error: advancedError } = await supabase
          .from(advancedIllnessTable)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (advancedError) {
          console.error('[AllQuestionnaires] Error fetching advanced illness questions:', advancedError);
          throw advancedError;
        }
        
        console.log('[AllQuestionnaires] Advanced illness questions loaded:', advancedData?.length);
        setAdvancedIllnessQuestions(advancedData || []);
        
        // Fetch preferences questions
        const { data: preferencesData, error: preferencesError } = await supabase
          .from(preferencesTable)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (preferencesError) {
          console.error('[AllQuestionnaires] Error fetching preferences questions:', preferencesError);
          throw preferencesError;
        }
        
        console.log('[AllQuestionnaires] Preferences questions loaded:', preferencesData?.length);
        setPreferencesQuestions(preferencesData || []);

      } catch (error) {
        console.error('[AllQuestionnaires] Unexpected error:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred while loading questionnaires." 
            : "Une erreur inattendue s'est produite lors du chargement des questionnaires.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchAllQuestionnaires();
    }
  }, [isOpen, toast, currentLanguage]);

  return {
    generalQuestions,
    lifeSupportQuestions,
    advancedIllnessQuestions,
    preferencesQuestions,
    loading
  };
}
