
import { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { AIAssistant } from '../ai-assistant/AIAssistant';
import { Button } from '../ui/button';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceEnabledQuestionCardProps {
  question: any;
  value: string[];
  onValueChange: (value: string, checked?: boolean) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  multiple?: boolean;
  voiceEnabled?: boolean;
}

export function VoiceEnabledQuestionCard({ 
  question, 
  value, 
  onValueChange, 
  options,
  multiple = false,
  voiceEnabled = true
}: VoiceEnabledQuestionCardProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { toast } = useToast();
  
  // Handler pour les réponses vocales
  const handleVoiceResponse = (response: string) => {
    const lowerResponse = response.toLowerCase();
    
    // Trouver la valeur correspondante dans les options
    const matchingOption = options.find(option => {
      const lowerLabel = option.label.toLowerCase();
      return lowerLabel.includes(lowerResponse) || lowerResponse.includes(lowerLabel);
    });
    
    if (matchingOption) {
      onValueChange(matchingOption.value, true);
      toast({
        title: "Réponse enregistrée",
        description: `Vous avez choisi: ${matchingOption.label}`,
      });
    }
  };
  
  // Extraire le texte de la question
  const questionText = question.question || question.question_text || '';
  
  return (
    <div className="relative">
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
        multiple={multiple}
      />
      
      {voiceEnabled && (
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full h-10 w-10 ${isVoiceActive ? 'bg-primary/10' : ''}`}
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            title={isVoiceActive ? "Désactiver l'assistant vocal" : "Activer l'assistant vocal"}
          >
            <Mic className={`h-5 w-5 ${isVoiceActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      )}
      
      {voiceEnabled && isVoiceActive && (
        <AIAssistant 
          questionText={questionText}
          onResponse={handleVoiceResponse}
          active={isVoiceActive}
        />
      )}
    </div>
  );
}
