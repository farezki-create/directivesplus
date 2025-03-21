
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MessageCircleQuestion } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface AIControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isSpeechRecognitionSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
  onAskExplanation: () => void;
}

export function AIControls({
  isListening,
  isSpeaking,
  isSpeechRecognitionSupported,
  onStartListening,
  onStopListening,
  onRecordingComplete,
  onAskExplanation
}: AIControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant={isListening ? "default" : "outline"}
        className={`flex items-center gap-2 ${isListening ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''}`}
        onClick={() => isListening ? onStopListening() : onStartListening()}
        disabled={!isSpeechRecognitionSupported}
      >
        <Mic className="h-4 w-4" />
        {isListening ? 'Écoute...' : 'Parler'}
      </Button>
      
      <VoiceRecorder 
        onRecordingComplete={onRecordingComplete}
        isDisabled={isListening || isSpeaking}
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onAskExplanation}
      >
        <MessageCircleQuestion className="h-5 w-5" />
      </Button>
    </div>
  );
}
