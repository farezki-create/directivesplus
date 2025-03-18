
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { useGeneralOpinion } from "@/hooks/useGeneralOpinion";
import { Button } from "@/components/ui/button";
import { QuestionWithExplanation } from "@/components/questions/QuestionWithExplanation";
import { useQuestionOptions } from "@/components/questions/QuestionOptions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralOpinion = () => {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading, answers, handleAnswerChange, handleSubmit } = useGeneralOpinion(true);
  const { getGeneralOpinionOptions } = useQuestionOptions();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const onSubmit = async () => {
    setIsSaving(true);
    const success = await handleSubmit();
    setIsSaving(false);
    if (success) {
      navigate("/");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={handleBack}>
              {t('back')}
            </Button>
            <h1 className="text-3xl font-bold text-center">
              {t('generalOpinion')}
            </h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 text-center">
            {t('generalOpinionDesc')}
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6 mb-8">
              {questions.map((question) => {
                // S'assurer que les données de la question sont complètes
                const enhancedQuestion = {
                  ...question,
                  question: question.question || question.question_text,
                  question_text: question.question_text || question.question,
                  explanation: question.explanation || ''
                };
                
                return (
                  <QuestionWithExplanation
                    key={question.id}
                    question={enhancedQuestion}
                    value={answers[question.id] || []}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    options={getGeneralOpinionOptions()}
                    language={currentLanguage as 'en' | 'fr'}
                  />
                );
              })}
              
              <div className="flex justify-center mt-8">
                <Button
                  onClick={onSubmit}
                  className="w-full max-w-md"
                  disabled={loading || isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                      {t('saving')}
                    </span>
                  ) : (
                    t('saveMyAnswers')
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p className="mb-2">{t('noQuestionFound')}</p>
              <p className="text-sm text-gray-500">Vérifiez la connexion à la base de données ou contactez l'administrateur.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GeneralOpinion;
