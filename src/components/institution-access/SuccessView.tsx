
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Eye } from "lucide-react";
import { AccessibleDataCard } from "./AccessibleDataCard";

interface SuccessViewProps {
  patientData: {
    first_name?: string;
    last_name?: string;
  } | null;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ patientData }) => {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Accès autorisé
          </h3>
          <p className="text-green-700 mb-4">
            Vous avez maintenant accès aux directives anticipées de{" "}
            <strong>
              {patientData?.first_name} {patientData?.last_name}
            </strong>
          </p>
          
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirection automatique en cours...
            </div>
            
            <Button 
              onClick={() => window.location.href = "/directives-acces"}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Eye className="mr-2 h-5 w-5" />
              Consulter maintenant
            </Button>
          </div>
        </CardContent>
      </Card>

      <AccessibleDataCard />
    </div>
  );
};
