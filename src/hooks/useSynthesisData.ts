
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
      // Get responses from all questionnaire types (including medical documents)
      const questionnaireTypes = ['avis-general', 'maintien-vie', 'maladie-avancee', 'gouts-peurs', 'medical-documents'];
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
      
      // Ajouter manuellement une récupération spécifique pour les préférences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('questionnaire_preferences_responses')
        .select('question_id, response, question_text')
        .eq('user_id', userId);
      
      if (!preferencesError && preferencesData && preferencesData.length > 0) {
        const preferencesResponses: Record<string, {response: string, question: string}> = {};
        
        preferencesData.forEach(item => {
          preferencesResponses[item.question_id] = {
            response: item.response,
            question: item.question_text
          };
        });
        
        allResponses['gouts-peurs'] = {
          ...allResponses['gouts-peurs'],
          ...preferencesResponses
        };
      }
      
      setResponses(allResponses);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des réponses:", error);
      throw error;
    }
  };

  const fetchPhrases = async () => {
    if (!userId) return;
    
    try {
      // Dans une implémentation réelle, nous récupérerions ces données de la base de données
      // Pour l'instant, nous allons simuler quelques phrases d'exemple
      
      const examplePhrasesData = [
        "Je souhaite être accompagné(e) dans la dignité jusqu'à la fin.",
        "Je souhaite que l'on privilégie mon confort et la qualité de ma fin de vie plutôt que sa durée."
      ];
      
      const customPhrasesData = [
        "Je souhaite que ma famille soit présente autant que possible.",
        "J'aimerais que l'on me lise des poèmes ou qu'on me fasse écouter de la musique classique."
      ];
      
      setExamplePhrases(examplePhrasesData);
      setCustomPhrases(customPhrasesData);
      
    } catch (error: any) {
      console.error("Erreur lors de la récupération des phrases:", error);
      // Continuer malgré l'erreur
    }
  };

  const fetchTrustedPersons = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Assurons-nous que les données de la personne de confiance sont correctement formatées
      const formattedPersons = data && data.length > 0 ? data.map(person => ({
        ...person,
        first_name: person.name ? person.name.split(' ')[0] : '',
        last_name: person.name ? person.name.split(' ').slice(1).join(' ') : ''
      })) : [];
      
      setTrustedPersons(formattedPersons);
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
