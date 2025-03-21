
import React from 'react';
import { AIAssistantAvatar } from './AIAssistantAvatar';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface AIAssistantHeaderProps {
  isSpeaking: boolean;
  isListening: boolean;
  onToggleSpeech: () => void;
  currentQuestion?: string;
}

export function AIAssistantHeader({
  isSpeaking,
  isListening,
  onToggleSpeech,
  currentQuestion
}: AIAssistantHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AIAssistantAvatar 
            size="sm" 
            isListening={isListening} 
            isSpeaking={isSpeaking} 
          />
          <h3 className="font-medium">Assistant Médical</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onToggleSpeech}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Affichage de la question courante */}
      {currentQuestion && (
        <div className="bg-muted p-3 rounded-lg mb-3 text-sm">
          <p className="font-medium mb-1">Question actuelle:</p>
          <p>{currentQuestion}</p>
        </div>
      )}
    </>
  );
}
