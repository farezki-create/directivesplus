
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SynthesisData {
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
}

export const useSynthesisData = (userId?: string) => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [examplePhrases, setExamplePhrases] = useState<string[]>([]);
  const [trustedPersons, setTrustedPersons] = useState<any[]>([]);
  const [freeText, setFreeText] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch questionnaire responses
        await fetchQuestionnaireResponses();
        
        // 2. Fetch example phrases and custom phrases
        await fetchPhrases();
        
        // 3. Fetch trusted persons
        await fetchTrustedPersons();
        
        // 4. Fetch existing synthesis if available
        await fetchExistingSynthesis();
        
      } catch (error: any) {
        console.error("Erreur lors du chargement des données de synthèse:", error.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger toutes les données pour la synthèse",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [userId]);

  const fetchQuestionnaireResponses = async () => {
    if (!userId) return;
    
    try {
      // Get responses from all questionnaire types
      const questionnaireTypes = ['avis-general', 'maintien-vie', 'maladie-avancee', 'gouts-peurs'];
      let allResponses: Record<string, any> = {};
      
      for (const type of questionnaireTypes) {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response, question_text')
          .eq('user_id', userId)
          .eq('questionnaire_type', type);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const typeResponses: Record<string, {response: string, question: string}> = {};
          
          data.forEach(item => {
            typeResponses[item.question_id] = {
              response: item.response,
              question: item.question_text
            };
          });
          
          allResponses[type] = typeResponses;
        }
      }
      
      setResponses(allResponses);
      console.log("Réponses au questionnaire récupérées:", allResponses);
      
    } catch (error: any) {
      console.error("Erreur lors de la récupération des réponses:", error);
      throw error;
    }
  };

  const fetchPhrases = async () => {
    // Pour l'instant, c'est un espace réservé. Dans une implémentation réelle,
    // nous récupérerions ces données de la base de données où l'utilisateur a stocké ses phrases sélectionnées.
    setExamplePhrases([]);
    setCustomPhrases([]);
  };

  const fetchTrustedPersons = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setTrustedPersons(data || []);
      console.log("Personnes de confiance récupérées:", data);
      
    } catch (error: any) {
      console.error("Erreur lors de la récupération des personnes de confiance:", error);
      throw error;
    }
  };

  const fetchExistingSynthesis = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('questionnaire_synthesis')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFreeText(data.free_text || "");
        console.log("Synthèse existante chargée:", data);
      }
      
    } catch (error: any) {
      console.error("Erreur lors de la récupération de la synthèse existante:", error);
      throw error;
    }
  };

  return {
    loading,
    responses,
    customPhrases,
    examplePhrases,
    trustedPersons,
    freeText,
    setFreeText
  };
};
