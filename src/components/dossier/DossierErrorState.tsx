
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DossierErrorStateProps {
  title: string;
  description: string;
  showRetry?: boolean;
  decryptionError?: string | null;
}

const DossierErrorState: React.FC<DossierErrorStateProps> = ({
  title,
  description,
  showRetry = false,
  decryptionError
}) => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl py-8">
      <Card className="shadow-lg p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
          <p className="text-lg text-amber-600 font-medium mb-2">{title}</p>
          <p className="text-gray-600 mb-4 text-center">
            {description}
            {decryptionError && <span className="block mt-2 text-red-500">{decryptionError}</span>}
          </p>
          <div className="flex space-x-4">
            {showRetry && (
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-2"
              >
                Réessayer
              </Button>
            )}
            <Button 
              onClick={() => navigate('/acces-document')}
              className="mt-2 bg-directiveplus-600 text-white hover:bg-directiveplus-700"
            >
              {showRetry ? "Nouveau code d'accès" : "Retour à la page d'accès"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DossierErrorState;
