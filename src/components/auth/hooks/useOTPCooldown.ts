
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useOTPCooldown = () => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Pas de cooldown timer - supprimé pour éviter les blocages
  
  const startCooldown = (newAttemptCount: number) => {
    const now = Date.now();
    setAttemptCount(newAttemptCount);
    setLastSentTime(now);
    // Pas d'activation de cooldown
  };

  const handleRateLimitError = () => {
    const now = Date.now();
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setLastSentTime(now);
    // Pas d'activation de cooldown
    
    toast({
      title: "Veuillez patienter",
      description: "Le serveur est temporairement surchargé. Réessayez dans quelques instants.",
      variant: "default",
    });
  };

  const resetCooldown = () => {
    setCooldownActive(false);
    setCooldownSeconds(0);
    setLastSentTime(0);
    setAttemptCount(0);
  };

  const checkCooldown = () => {
    // Toujours autoriser l'envoi - pas de vérification de cooldown
    return null;
  };

  const resetAttemptCount = () => {
    setAttemptCount(0);
    setCooldownActive(false);
    setCooldownSeconds(0);
  };

  return {
    attemptCount,
    cooldownActive: false, // Toujours false
    cooldownSeconds: 0, // Toujours 0
    lastSentTime,
    startCooldown,
    handleRateLimitError,
    resetCooldown,
    checkCooldown,
    resetAttemptCount
  };
};
