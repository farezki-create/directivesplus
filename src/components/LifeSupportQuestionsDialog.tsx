import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ open, onOpenChange }: LifeSupportQuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching life support questions...");
        const { data, error } = await supabase
          .from('life_support_questions')
          .select('*');
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from life_support_questions table:', data);
        setQuestions(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Réponses soumises:', answers);
    // TODO: Implement answer submission logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Maintien en vie
            </DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : questions.length > 0 ? (
            <ScrollArea className="flex-1 px-1">
              <div className="space-y-6 py-4">
                {questions.map((question) => (
                  <div 
                    key={question.id} 
                    className="p-6 bg-card rounded-lg border shadow-sm"
                  >
                    <p className="text-lg font-medium mb-4">{question.question}</p>
                    <RadioGroup
                      value={answers[question.id]}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="indecision" id={`${question.id}-indecision`} />
                        <Label htmlFor={`${question.id}-indecision`} className="text-base">
                          {question.Indécision}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oui" id={`${question.id}-oui`} />
                        <Label htmlFor={`${question.id}-oui`} className="text-base">
                          {question.Oui}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oui_duree_moderee" id={`${question.id}-oui_duree_moderee`} />
                        <Label htmlFor={`${question.id}-oui_duree_moderee`} className="text-base">
                          {question["Oui pour une durée modérée"]}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oui_medical" id={`${question.id}-oui_medical`} />
                        <Label htmlFor={`${question.id}-oui_medical`} className="text-base">
                          {question["Oui seulement si l'équipe médicale le juge utile"]}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_abandonner" id={`${question.id}-non_abandonner`} />
                        <Label htmlFor={`${question.id}-non_abandonner`} className="text-base">
                          {question["Non rapidement abandonner le thérapeutique"]}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_souffrance" id={`${question.id}-non_souffrance`} />
                        <Label htmlFor={`${question.id}-non_souffrance`} className="text-base">
                          {question["La non souffrance est à privilégier"]}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Aucune question trouvée.
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto"
              disabled={loading || questions.length === 0}
            >
              Enregistrer mes réponses
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}