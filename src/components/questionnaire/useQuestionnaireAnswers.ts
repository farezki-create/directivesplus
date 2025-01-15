import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";
import { Database } from "@/integrations/supabase/types";
import { useSession } from "@supabase/auth-helpers-react";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";
type TableNames = Database["public"]["Tables"];

export function useQuestionnaireAnswers(questionnaireType: QuestionnaireType) {
  const session = useSession();

  return useQuery({
    queryKey: [`${questionnaireType}-answers`, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log('Aucune session utilisateur trouvée');
        return [];
      }

      console.log(`Chargement des réponses ${questionnaireType} pour l'utilisateur ${session.user.id}...`);
      
      const { data: answers, error: answersError } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('questionnaire_type', questionnaireType)
        .eq('user_id', session.user.id);

      if (answersError) {
        console.error(`Erreur lors du chargement des réponses ${questionnaireType}:`, answersError);
        throw answersError;
      }

      if (!answers?.length) {
        console.log(`Aucune réponse ${questionnaireType} trouvée pour l'utilisateur`);
        return [];
      }

      let questionsTable: keyof TableNames;
      let questionField: string;
      
      switch (questionnaireType) {
        case 'life_support':
          questionsTable = 'life_support_questions';
          questionField = 'question';
          break;
        case 'advanced_illness':
          questionsTable = 'advanced_illness_questions';
          questionField = 'question';
          break;
        case 'preferences':
          questionsTable = 'preferences_questions';
          questionField = 'question';
          break;
        default:
          questionsTable = 'questions';
          questionField = 'Question';
      }

      const { data: questions, error: questionsError } = await supabase
        .from(questionsTable)
        .select('*');

      if (questionsError) {
        console.error(`Erreur lors du chargement des questions ${questionnaireType}:`, questionsError);
        throw questionsError;
      }

      console.log(`${answers.length} réponses et ${questions.length} questions trouvées`);

      const questionsMap = new Map(
        questions.map((q: any) => [q.id, q[questionField]])
      );

      return answers.map(answer => ({
        id: answer.id,
        answer: answer.answer,
        question: {
          question: questionsMap.get(answer.question_id)
        }
      })) as QuestionnaireAnswer[];
    },
    enabled: !!session?.user?.id,
  });
}