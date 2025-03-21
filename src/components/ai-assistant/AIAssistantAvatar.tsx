
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Glasses, Smile, Stethoscope } from 'lucide-react';

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
  const [animationState, setAnimationState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  
  // Définir les tailles en fonction de l'option
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };
  
  // Mettre à jour l'état d'animation en fonction des props
  useEffect(() => {
    if (isListening) {
      setAnimationState('listening');
    } else if (isSpeaking) {
      setAnimationState('speaking');
    } else {
      setAnimationState('idle');
    }
  }, [isListening, isSpeaking]);

  // Couleur de bordure basée sur l'état
  const getBorderColor = () => {
    if (isListening) return "border-green-500 animate-pulse";
    if (isSpeaking) return "border-blue-500 animate-pulse";
    return "border-gray-200";
  };

  // Effet de mouvement pour l'avatar
  const getAvatarAnimation = () => {
    if (isSpeaking) {
      return "animate-[bounce_1s_ease-in-out_infinite]";
    }
    if (isListening) {
      return "animate-pulse";
    }
    return "hover:scale-105 transition-transform duration-300";
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <Avatar 
        className={`${sizeClasses[size]} border-2 ${getBorderColor()} bg-white shadow-lg ${getAvatarAnimation()}`}
      >
        <AvatarImage 
          src="/ai-doctor-avatar.png" 
          alt="Assistant médical IA" 
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary flex flex-col items-center justify-center">
          <Stethoscope className="h-1/3 w-1/3" />
          <div className="flex items-center mt-1">
            <Glasses className="h-1/5 w-1/5" />
            <Smile className="h-1/5 w-1/5 ml-1" />
          </div>
        </AvatarFallback>
      </Avatar>
      
      {/* Indicateur d'état avec animation améliorée */}
      {(isListening || isSpeaking) && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
          {isListening ? (
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" title="Écoute en cours" />
          ) : isSpeaking ? (
            <div className="flex space-x-0.5">
              <div className="h-3 w-1 rounded-full bg-blue-500 animate-[scale-in_0.4s_ease-in-out_infinite_alternate]" />
              <div className="h-3 w-1 rounded-full bg-blue-500 animate-[scale-in_0.5s_ease-in-out_infinite_alternate]" />
              <div className="h-3 w-1 rounded-full bg-blue-500 animate-[scale-in_0.3s_ease-in-out_infinite_alternate]" />
            </div>
          ) : null}
        </div>
      )}
      
      {/* Animation de sourire quand l'assistant est actif */}
      <div className={`absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1 shadow-sm ${isListening || isSpeaking ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <Smile className="h-3 w-3 text-white" />
      </div>
    </div>
  );
}
