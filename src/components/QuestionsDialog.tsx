import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching general opinion questions...");
        const { data, error } = await supabase
          .from('questions')
          .select('*');
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from questions table:', data);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mon avis d'une façon générale</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
            <p>Chargement des questions...</p>
          ) : questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <p className="font-medium mb-2">{question.Question}</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="oui"
                      className="w-4 h-4"
                    />
                    Oui
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="non"
                      className="w-4 h-4"
                    />
                    Non
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune question trouvée. Veuillez vérifier la table questions dans Supabase.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}