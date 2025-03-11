
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
      try {
        setLoading(true);
        console.log(`[LifeSupport] Tentative de connexion à Supabase...`);
        console.log(`[LifeSupport] Langue actuelle: ${currentLanguage}`);
        
        // Déterminer quelle table interroger en fonction de la langue
        const tableName = currentLanguage === 'en' ? 'questionnaire_life_support_en' : 'questionnaire_life_support_fr';
        console.log(`[LifeSupport] Utilisation de la table: ${tableName}`);
        
        // Log de l'URL Supabase pour vérifier la connexion
        console.log(`[LifeSupport] URL Supabase: ${supabase.supabaseUrl}`);
        
        if (currentLanguage === 'en') {
          // Pour l'anglais, récupérer depuis la table anglaise
          const { data, error } = await supabase
            .from('questionnaire_life_support_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Erreur lors de la récupération des questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] Questions anglaises chargées:', data?.length || 0, 'questions');
          if (data?.length > 0) {
            console.log('[LifeSupport] Première question anglaise:', data[0]);
          } else {
            console.log('[LifeSupport] Aucune question anglaise trouvée');
          }
          
          setQuestions(data || []);
        } else {
          // Pour le français, récupérer depuis la table française
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*');
          
          if (error) {
            console.error('[LifeSupport] Erreur lors de la récupération des questions françaises:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] Données brutes récupérées:', JSON.stringify(data));
          
          // Transformer les questions françaises pour correspondre au format attendu
          const formattedData = data?.map(item => ({
            id: item.id.toString(), 
            question: item.question_text,
            display_order: item.question_order,
            options: {
              yes: item.option_yes,
              no: item.option_no,
              unsure: item.option_unsure
            }
          })) || [];
          
          console.log('[LifeSupport] Questions françaises formatées:', JSON.stringify(formattedData));
          
          setQuestions(formattedData);
        }
      } catch (error) {
        console.error('[LifeSupport] Erreur inattendue:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred." 
            : "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isDialogOpen) {
      fetchQuestions();
    } else {
      // Réinitialiser les questions lorsque le dialogue est fermé
      setQuestions([]);
    }
  }, [isDialogOpen, toast, currentLanguage, t]);

  return { questions, loading };
}
