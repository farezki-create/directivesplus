import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";

type LinkingTableName = 
  | "questionnaire_general_opinion_answers"
  | "questionnaire_life_support_answers"
  | "questionnaire_advanced_illness_answers"
  | "questionnaire_preferences_answers";

export function useQuestionnaireSubmission(questionnaireType: QuestionnaireType) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`Mise à jour de la réponse pour la question ${questionId}:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const saveToLinkingTable = async (answerId: string, questionId: string) => {
    let tableName: LinkingTableName;
    
    switch (questionnaireType) {
      case 'general_opinion':
        tableName = 'questionnaire_general_opinion_answers';
        break;
      case 'life_support':
        tableName = 'questionnaire_life_support_answers';
        break;
      case 'advanced_illness':
        tableName = 'questionnaire_advanced_illness_answers';
        break;
      case 'preferences':
        tableName = 'questionnaire_preferences_answers';
        break;
      default:
        console.error('Type de questionnaire non reconnu:', questionnaireType);
        throw new Error('Type de questionnaire non reconnu');
    }

    const { error } = await supabase
      .from(tableName)
      .insert({
        answer_id: answerId,
        question_id: questionId
      });

    if (error) {
      console.error(`Erreur lors de l'enregistrement dans la table ${tableName}:`, error);
      throw error;
    }
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      console.error('Aucune session utilisateur trouvée');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    try {
      console.log('Début de la sauvegarde des réponses:', answers);
      
      // Sauvegarder les réponses individuelles
      for (const [questionId, answer] of Object.entries(answers)) {
        const { data, error } = await supabase
          .from('questionnaire_answers')
          .insert({
            user_id: session.user.id,
            questionnaire_type: questionnaireType,
            question_id: questionId,
            answer: answer
          })
          .select('id')
          .single();

        if (error) {
          console.error('Erreur lors de la sauvegarde de la réponse:', error);
          throw error;
        }

        // Sauvegarder dans la table de liaison correspondante
        await saveToLinkingTable(data.id, questionId);
      }

      // Mettre à jour la synthèse
      const { error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (synthesisError) {
        console.error('Erreur lors de la mise à jour de la synthèse:', synthesisError);
        throw synthesisError;
      }

      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      if (onSuccess) {
        onSuccess();
      }

      // Ajout d'un délai avant la navigation
      setTimeout(() => {
        navigate('/free-text');
      }, 500);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    }
  };

  return {
    answers,
    handleAnswerChange,
    handleSubmit
  };
}