
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

// Define precise types for our question structures
interface EnQuestion {
  id: string;
  display_order: number;
  created_at?: string;
  question: string;
  explanation?: string;
}

interface FrQuestion {
  id: number;
  question_order: number;
  question_text: string;
  option_yes: string;
  option_no: string;
  option_unsure: string;
  explanation?: string;
}

// Union type for all possible question formats
type Question = EnQuestion | FrQuestion;

// Type guard to check if a question is in English format
function isEnglishQuestion(question: Question): question is EnQuestion {
  return typeof (question as EnQuestion).display_order !== 'undefined';
}

// Type guard to check if a question is in French format
function isFrenchQuestion(question: Question): question is FrQuestion {
  return typeof (question as FrQuestion).question_order !== 'undefined';
}

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
        
        // Determine table name based on language
        const tableName = currentLanguage === 'en' 
          ? 'questionnaire_life_support_en' 
          : 'questionnaire_life_support_fr';
        
        console.log(`[LifeSupport] Fetching from table: ${tableName}`);
        
        // Use a simple query with no complex joins or filters
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(currentLanguage === 'en' ? 'display_order' : 'question_order', { ascending: true });
        
        if (error) {
          console.error(`[LifeSupport] Error fetching questions: ${error.message}`, error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          setLoading(false);
          setQuestions([]);
          return;
        }
        
        console.log(`[LifeSupport] Questions loaded: ${data?.length || 0}`);
        if (data?.[0]) {
          console.log('[LifeSupport] First question sample:', data[0]);
        } else {
          console.warn('[LifeSupport] No questions found in the database.');
          setQuestions([]);
          setLoading(false);
          return;
        }
        
        // Format the questions based on language
        let formattedData: any[] = [];
        
        if (currentLanguage === 'en') {
          formattedData = data.map((item: any) => {
            // Ensure it has the structure we expect for English questions
            if (typeof item.display_order !== 'undefined' && typeof item.question !== 'undefined') {
              return {
                id: item.id || `en-${item.display_order}`,
                question: item.question || '',
                question_text: item.question || '', // Ensure both fields exist
                display_order: item.display_order,
                explanation: item.explanation || '',
                options: {
                  yes: "Yes",
                  no: "No",
                  unsure: "I'm not sure"
                }
              };
            }
            // Unexpected format, log and return a default structure
            console.error('[LifeSupport] Unexpected English question format:', item);
            return null;
          }).filter(Boolean); // Filter out any null items
        } else {
          formattedData = data.map((item: any) => {
            // Ensure it has the structure we expect for French questions
            if (typeof item.question_order !== 'undefined' && typeof item.question_text !== 'undefined') {
              return {
                id: item.id?.toString() || `fr-${item.question_order}`,
                question_text: item.question_text || '',
                question: item.question_text || '', // Ensure both fields exist
                display_order: item.question_order || 0,
                question_order: item.question_order || 0,
                explanation: item.explanation || '',
                options: {
                  yes: item.option_yes || "Oui",
                  no: item.option_no || "Non",
                  unsure: item.option_unsure || "Je ne suis pas sûr(e)"
                }
              };
            }
            // Unexpected format, log and return a default structure
            console.error('[LifeSupport] Unexpected French question format:', item);
            return null;
          }).filter(Boolean); // Filter out any null items
        }
        
        console.log(`[LifeSupport] Formatted questions count: ${formattedData.length}`);
        setQuestions(formattedData);
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
