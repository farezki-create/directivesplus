
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const SharedDocumentsAccessForm = () => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Fonctionnalité désactivée</strong><br />
          L'accès aux documents partagés a été temporairement désactivé pour simplification.
        </AlertDescription>
      </Alert>
    </div>
  );
};
