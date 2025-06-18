
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { useFeedbackSurvey, FeedbackQuestion } from '@/hooks/useFeedbackSurvey';
import { toast } from '@/hooks/use-toast';

const FeedbackSurvey = () => {
  const { questions, responses, loading, submitting, updateResponse, submitResponses } = useFeedbackSurvey();
  const [showSurvey, setShowSurvey] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Chargement du questionnaire...</div>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitResponses();
    if (success) {
      setShowSurvey(false);
    }
  };

  const renderQuestion = (question: FeedbackQuestion) => {
    const { id, question_text, question_type, options } = question;

    switch (question_type) {
      case 'single_choice':
        const choices = Array.isArray(options) ? options : [];
        return (
          <div key={id} className="space-y-3">
            <Label className="text-base font-medium">{question_text}</Label>
            <RadioGroup
              value={responses[id] || ''}
              onValueChange={(value) => updateResponse(id, value)}
            >
              {choices.map((choice: string) => (
                <div key={choice} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice} id={`${id}-${choice}`} />
                  <Label htmlFor={`${id}-${choice}`}>{choice}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'multiple_choice':
        const multiChoices = Array.isArray(options) ? options : [];
        const currentSelections = responses[id] ? responses[id].split(',') : [];
        
        const handleMultipleChoice = (choice: string, checked: boolean) => {
          let newSelections;
          if (checked) {
            newSelections = [...currentSelections, choice];
          } else {
            newSelections = currentSelections.filter(item => item !== choice);
          }
          updateResponse(id, newSelections.join(','));
        };

        return (
          <div key={id} className="space-y-3">
            <Label className="text-base font-medium">{question_text}</Label>
            <div className="space-y-2">
              {multiChoices.map((choice: string) => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}-${choice}`}
                    checked={currentSelections.includes(choice)}
                    onCheckedChange={(checked) => handleMultipleChoice(choice, checked as boolean)}
                  />
                  <Label htmlFor={`${id}-${choice}`}>{choice}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rating':
        const ratingOptions = options || { min: 1, max: 5 };
        const currentRating = parseInt(responses[id]) || 0;
        
        return (
          <div key={id} className="space-y-3">
            <Label className="text-base font-medium">{question_text}</Label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: ratingOptions.max }, (_, i) => i + 1).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateResponse(id, rating.toString())}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      rating <= currentRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {currentRating > 0 && ratingOptions.labels?.[currentRating] || ''}
              </span>
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={id} className="space-y-3">
            <Label className="text-base font-medium">{question_text}</Label>
            <Textarea
              value={responses[id] || ''}
              onChange={(e) => updateResponse(id, e.target.value)}
              placeholder="Votre réponse..."
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, FeedbackQuestion[]>);

  if (!showSurvey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💭</span>
            Donnez votre avis sur DirectivesPlus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Votre avis nous aide à améliorer l'application. Ce questionnaire ne prend que quelques minutes.
          </p>
          <Button onClick={() => setShowSurvey(true)}>
            Commencer le questionnaire
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionnaire d'avis sur DirectivesPlus</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-lg font-semibold capitalize bg-gray-50 p-3 rounded">
                {category}
              </h3>
              {categoryQuestions.map(renderQuestion)}
            </div>
          ))}

          <div className="flex gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowSurvey(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Envoi en cours...' : 'Envoyer mes réponses'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackSurvey;
