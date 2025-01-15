import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionnaireAnswer {
  id: string;
  question: {
    Question?: string;
    question?: string;
  };
  answer: string;
}

const FreeText = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const { data: generalAnswers, isLoading: loadingGeneral } = useQuery({
    queryKey: ["general-answers"],
    queryFn: async () => {
      console.log("Fetching general opinion answers...");
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          answer,
          question:question_id (
            Question
          )
        `)
        .eq('questionnaire_type', 'general_opinion');

      if (error) {
        console.error("Error fetching general answers:", error);
        throw error;
      }
      return answers as QuestionnaireAnswer[];
    },
  });

  const { data: lifeSupportAnswers, isLoading: loadingLifeSupport } = useQuery({
    queryKey: ["life-support-answers"],
    queryFn: async () => {
      console.log("Fetching life support answers...");
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          answer,
          question:question_id (
            question
          )
        `)
        .eq('questionnaire_type', 'life_support');

      if (error) {
        console.error("Error fetching life support answers:", error);
        throw error;
      }
      return answers as QuestionnaireAnswer[];
    },
  });

  const { data: advancedIllnessAnswers, isLoading: loadingAdvancedIllness } = useQuery({
    queryKey: ["advanced-illness-answers"],
    queryFn: async () => {
      console.log("Fetching advanced illness answers...");
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          answer,
          question:question_id (
            question
          )
        `)
        .eq('questionnaire_type', 'advanced_illness');

      if (error) {
        console.error("Error fetching advanced illness answers:", error);
        throw error;
      }
      return answers as QuestionnaireAnswer[];
    },
  });

  const { data: preferencesAnswers, isLoading: loadingPreferences } = useQuery({
    queryKey: ["preferences-answers"],
    queryFn: async () => {
      console.log("Fetching preferences answers...");
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          answer,
          question:question_id (
            question
          )
        `)
        .eq('questionnaire_type', 'preferences');

      if (error) {
        console.error("Error fetching preferences answers:", error);
        throw error;
      }
      return answers as QuestionnaireAnswer[];
    },
  });

  const isLoading = loadingGeneral || loadingLifeSupport || loadingAdvancedIllness || loadingPreferences;

  const renderAnswers = (answers: QuestionnaireAnswer[] | undefined, title: string) => {
    if (!answers?.length) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <ul className="space-y-2">
          {answers.map((answer) => (
            <li key={answer.id} className="border-b pb-2">
              <p className="font-medium">{answer.question?.Question || answer.question?.question}</p>
              <p className="text-muted-foreground">{answer.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Synthèse et expression libre</h1>
          
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Synthèse de vos réponses</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <>
                {renderAnswers(generalAnswers, "Mon avis général")}
                {renderAnswers(lifeSupportAnswers, "Maintien de la vie")}
                {renderAnswers(advancedIllnessAnswers, "Maladie avancée")}
                {renderAnswers(preferencesAnswers, "Mes goûts et mes peurs")}
              </>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
            <p className="text-muted-foreground mb-4">
              Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
            </p>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez ici..."
              className="min-h-[200px] mb-6"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Retour
            </Button>
            <Button
              onClick={() => {
                // TODO: Save the text
                navigate("/");
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeText;