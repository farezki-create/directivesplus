
import React from "react";
import { Alert, AlertCircle, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";
import BackButton from "@/components/ui/back-button";

interface DossierHeaderProps {
  dossierId: string;
  onClose: () => void;
}

const DossierHeader: React.FC<DossierHeaderProps> = ({ dossierId, onClose }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <BackButton />
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onClose}
        >
          <LogOut size={16} />
          Fermer le dossier
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        Consultation du Dossier Médical
      </h1>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription className="flex items-center">
          <span>Vous consultez le dossier médical avec l'identifiant {dossierId}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldCheck className="h-4 w-4 ml-2 text-green-600" />
              </TooltipTrigger>
              <TooltipContent>Données chiffrées</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DossierHeader;
