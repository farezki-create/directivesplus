
import React from "react";
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
  if (!isActive || !expiryDate) return null;

  const remainingMinutes = Math.ceil((expiryDate.getTime() - Date.now()) / 60000);

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Clock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        Limite d'emails atteinte. Veuillez patienter {remainingMinutes} minute(s).
      </AlertDescription>
    </Alert>
  );
};
