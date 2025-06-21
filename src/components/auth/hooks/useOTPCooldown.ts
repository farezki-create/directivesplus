
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useOTPCooldown = () => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Cooldown timer - réduit à 30 secondes pour être plus tolérant
  useEffect(() => {
    if (!cooldownActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastSentTime;
      const remainingTime = Math.max(0, 30000 - timeElapsed); // 30 secondes au lieu de 60
      
      if (remainingTime <= 0) {
        setCooldownActive(false);
        setCooldownSeconds(0);
        setAttemptCount(0); // Reset attempt count when cooldown expires
      } else {
        setCooldownSeconds(Math.ceil(remainingTime / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownActive, lastSentTime]);

  const startCooldown = (newAttemptCount: number) => {
    const now = Date.now();
    setAttemptCount(newAttemptCount);
    setLastSentTime(now);
    
    // Activer le cooldown seulement après 5 tentatives (plus tolérant)
    if (newAttemptCount >= 5) {
      setCooldownActive(true);
    }
  };

  const handleRateLimitError = () => {
    const now = Date.now();
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setLastSentTime(now);
    setCooldownActive(true);
    
    toast({
      title: "Veuillez patienter",
      description: "Un petit délai est nécessaire avant le prochain envoi. Merci de votre patience.",
      variant: "default", // Changé de "destructive" à "default" pour être moins alarmant
    });
  };

  const resetCooldown = () => {
    setCooldownActive(false);
    setCooldownSeconds(0);
    setLastSentTime(0);
    setAttemptCount(0);
    
    toast({
      title: "Prêt à continuer",
      description: "Vous pouvez maintenant renvoyer un code.",
    });
  };

  const checkCooldown = () => {
    const now = Date.now();
    
    // Vérifier le cooldown local seulement si on a 5+ tentatives (plus tolérant)
    if (attemptCount >= 5 && now - lastSentTime < 30000) {
      const remainingSeconds = Math.ceil((30000 - (now - lastSentTime)) / 1000);
      return `Veuillez patienter ${remainingSeconds} secondes avant le prochain envoi.`;
    }
    
    return null;
  };

  const resetAttemptCount = () => {
    setAttemptCount(0);
    setCooldownActive(false);
    setCooldownSeconds(0);
  };

  return {
    attemptCount,
    cooldownActive,
    cooldownSeconds,
    lastSentTime,
    startCooldown,
    handleRateLimitError,
    resetCooldown,
    checkCooldown,
    resetAttemptCount
  };
};
