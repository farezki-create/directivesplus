
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

type Question = {
  id: string;
  question: string;
  explanation?: string | null;
  display_order?: number | null;
  options?: {
    yes: string;
    no: string;
    unsure: string;
  };
};

const getSectionTable = (sectionId: string) => {
  switch(sectionId) {
    case 'avis-general':
      return 'questionnaire_general_fr';
    case 'maintien-vie':
      return 'questionnaire_life_support_fr';
    case 'maladie-avancee':
      return 'questionnaire_advanced_illness_fr';
    case 'gouts-peurs':
      return 'questionnaire_preferences_fr';
    default:
      return '';
  }
};

const getResponseTable = (sectionId: string) => {
  if (sectionId === 'gouts-peurs') {
    return 'questionnaire_preferences_responses';
  }
  return 'questionnaire_responses';
};

const QuestionnaireSection = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!pageId) return;
      
      setLoading(true);
      setError(null);
      
      const tableName = getSectionTable(pageId);
      if (!tableName) {
        setError(`Section "${pageId}" non trouvée`);
        setLoading(false);
        return;
      }
      
      try {
        // Fetching questions
        let { data: questionsData, error: questionsError } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        // Format questions based on table structure
        let formattedQuestions: Question[] = [];
        
        if (tableName === 'questionnaire_life_support_fr') {
          // Special handling for life support questions
          formattedQuestions = (questionsData || []).map(q => ({
            id: q.id.toString(),
            question: q.question_text,
            explanation: q.explanation,
            display_order: q.question_order,
            options: {
              yes: q.option_yes,
              no: q.option_no,
              unsure: q.option_unsure
            }
          }));
        } else {
          formattedQuestions = questionsData || [];
        }
        
        setQuestions(formattedQuestions);
        
        // Fetch existing responses
        const responseTable = getResponseTable(pageId);
        const { data: responsesData, error: responsesError } = await supabase
          .from(responseTable)
          .select('question_id, response')
          .eq('questionnaire_type', pageId);
        
        if (responsesError) throw responsesError;
        
        // Convert responses array to object
        const responsesObj: Record<string, string> = {};
        (responsesData || []).forEach(r => {
          responsesObj[r.question_id] = r.response;
        });
        
        setResponses(responsesObj);
        
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
        setError('Erreur lors du chargement des questions. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [pageId]);
  
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSave = async () => {
    if (!pageId) return;
    
    setSaving(true);
    
    try {
      const responseTable = getResponseTable(pageId);
      const responsesToSave = Object.entries(responses).map(([questionId, response]) => ({
        question_id: questionId,
        response,
        questionnaire_type: pageId,
        question_text: questions.find(q => q.id === questionId)?.question || ''
      }));
      
      // Delete existing responses
      const { error: deleteError } = await supabase
        .from(responseTable)
        .delete()
        .eq('questionnaire_type', pageId);
      
      if (deleteError) throw deleteError;
      
      // Insert new responses
      const { error: insertError } = await supabase
        .from(responseTable)
        .insert(responsesToSave);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });
      
    } catch (err) {
      console.error('Error saving responses:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        {pageId === 'avis-general' && "Avis Général"}
        {pageId === 'maintien-vie' && "Maintien de la Vie"}
        {pageId === 'maladie-avancee' && "Maladie Avancée"}
        {pageId === 'gouts-peurs' && "Mes Goûts et Mes Peurs"}
        {pageId === 'personne-confiance' && "Personne de Confiance"}
        {pageId === 'exemples-phrases' && "Exemples de Phrases"}
      </h1>
      
      {questions.map((question) => (
        <Card key={question.id} className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">{question.question}</h3>
            {question.explanation && (
              <p className="text-gray-600 mb-4 text-sm">{question.explanation}</p>
            )}
            
            {question.options ? (
              // Display radio buttons for questions with predefined options
              <RadioGroup 
                value={responses[question.id] || ''} 
                onValueChange={(value) => handleResponseChange(question.id, value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`}>{question.options.yes}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`}>{question.options.no}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id={`${question.id}-unsure`} />
                  <Label htmlFor={`${question.id}-unsure`}>{question.options.unsure}</Label>
                </div>
              </RadioGroup>
            ) : (
              // Display textarea for free text answers
              <Textarea 
                placeholder="Votre réponse..."
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="mt-2"
                rows={4}
              />
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-directiveplus-600 hover:bg-directiveplus-700"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireSection;
