
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface RateLimitDisplayProps {
  isActive: boolean;
  expiryDate: Date | null;
}

export const RateLimitDisplay: React.FC<RateLimitDisplayProps> = ({
  isActive,
  expiryDate
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!isActive || !expiryDate) {
      setRemainingTime(0);
      return;
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiryDate.getTime() - now);
      setRemainingTime(remaining);
    };

    // Update immediately
    updateRemainingTime();

    // Update every second
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [isActive, expiryDate]);

  if (!isActive || remainingTime <= 0) return null;

  const remainingMinutes = Math.ceil(remainingTime / 60000);
  const remainingSeconds = Math.ceil((remainingTime % 60000) / 1000);

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Clock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        Limite d'emails atteinte. Veuillez patienter{" "}
        {remainingMinutes > 0 ? (
          `${remainingMinutes} minute(s)`
        ) : (
          `${remainingSeconds} seconde(s)`
        )}.
      </AlertDescription>
    </Alert>
  );
};
