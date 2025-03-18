
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { useLifeSupportQuestions } from "@/hooks/useLifeSupportQuestions";
import { useLifeSupportAnswers } from "@/hooks/useLifeSupportAnswers";
import { Button } from "@/components/ui/button";
import { QuestionWithExplanation } from "@/components/questions/QuestionWithExplanation";
import { useQuestionOptions } from "@/components/questions/QuestionOptions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LifeSupport = () => {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useLifeSupportQuestions(true);
  const { answers, handleAnswerChange, handleSubmit } = useLifeSupportAnswers(questions);
  const { getLifeSupportOptions } = useQuestionOptions();
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
              {t('lifeSupport')}
            </h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 text-center">
            {t('advancedIllnessDesc')}
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-6 mb-8">
              {questions.map((question) => {
                // Enhance question with explicit life support flag
                const enhancedQuestion = {
                  ...question,
                  question: question.question || question.question_text,
                  question_text: question.question_text || question.question,
                  isLifeSupportQuestion: true
                };
                
                return (
                  <QuestionWithExplanation
                    key={question.id}
                    question={enhancedQuestion}
                    value={answers[question.id] || []}
                    onValueChange={(value) => handleAnswerChange(question.id, value, true)}
                    options={getLifeSupportOptions()}
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

export default LifeSupport;
