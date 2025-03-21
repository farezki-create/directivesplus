
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Glasses, MessageCircleQuestion, Smile, Stethoscope } from 'lucide-react';

interface AIAssistantAvatarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AIAssistantAvatar({ 
  isListening = false, 
  isSpeaking = false,
  size = "md" 
}: AIAssistantAvatarProps) {
  // Définir les tailles en fonction de l'option
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };
  
  // Couleur de bordure basée sur l'état
  const getBorderColor = () => {
    if (isListening) return "border-green-500 animate-pulse";
    if (isSpeaking) return "border-blue-500 animate-pulse";
    return "border-gray-200";
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <Avatar className={`${sizeClasses[size]} border-2 ${getBorderColor()} bg-white`}>
        <AvatarImage src="/ai-doctor-avatar.png" alt="Assistant médical IA" />
        <AvatarFallback className="bg-primary/10 text-primary flex flex-col items-center justify-center">
          <Stethoscope className="h-1/3 w-1/3" />
          <div className="flex items-center mt-1">
            <Glasses className="h-1/5 w-1/5" />
            <Smile className="h-1/5 w-1/5 ml-1" />
          </div>
        </AvatarFallback>
      </Avatar>
      
      {/* Indicateur d'état */}
      {(isListening || isSpeaking) && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {isListening ? (
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" title="Écoute en cours" />
          ) : isSpeaking ? (
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" title="Parle en cours" />
          ) : null}
        </div>
      )}
    </div>
  );
}
