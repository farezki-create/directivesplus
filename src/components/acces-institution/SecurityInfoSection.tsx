
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const SecurityInfoSection: React.FC = () => {
  return (
    <div className="mt-8">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Sécurité et confidentialité :</strong> Cet accès est sécurisé et tracé. 
          Seuls les professionnels de santé autorisés peuvent consulter les données 
          avec le consentement du patient via son code d'accès personnel.
        </AlertDescription>
      </Alert>
    </div>
  );
};
