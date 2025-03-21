
import React from 'react';
import { AIAssistantAvatar } from './AIAssistantAvatar';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface AIAssistantHeaderProps {
  isSpeaking: boolean;
  isListening: boolean;
  autoSpeak: boolean;
  onToggleAutoSpeech: () => void;
  currentQuestion?: string;
}

export function AIAssistantHeader({
  isSpeaking,
  isListening,
  autoSpeak,
  onToggleAutoSpeech,
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
            onClick={onToggleAutoSpeech}
            title={autoSpeak ? "Désactiver la parole automatique" : "Activer la parole automatique"}
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isSpeaking && autoSpeak && <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>}
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
