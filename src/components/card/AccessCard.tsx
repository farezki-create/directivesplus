
import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode } from "@/hooks/useAccessCode";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import { downloadCard, printCard } from "./utils/cardOperations";
import { toast } from "@/hooks/use-toast";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  const directiveCode = useAccessCode(user, "directive");
  const medicalCode = useAccessCode(user, "medical");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [includeDirective, setIncludeDirective] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);
  
  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger la carte",
        variant: "destructive"
      });
      return;
    }
    
    if (!directiveCode && includeDirective) {
      toast({
        title: "Erreur",
        description: "Le code d'accès aux directives n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    if (!medicalCode && includeMedical) {
      toast({
        title: "Erreur",
        description: "Le code d'accès médical n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    await downloadCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };
  
  const handlePrint = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour imprimer la carte",
        variant: "destructive"
      });
      return;
    }
    
    if (!directiveCode && includeDirective) {
      toast({
        title: "Erreur",
        description: "Le code d'accès aux directives n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    if (!medicalCode && includeMedical) {
      toast({
        title: "Erreur",
        description: "Le code d'accès médical n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    await printCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };

  // Vérifier si les codes sont disponibles
  const isCardReady = (includeDirective && !directiveCode) || (includeMedical && !medicalCode) ? false : true;

  return (
    <div className="space-y-8">
      <CardOptions 
        includeDirective={includeDirective}
        setIncludeDirective={setIncludeDirective}
        includeMedical={includeMedical}
        setIncludeMedical={setIncludeMedical}
      />
      
      <div className="flex flex-col items-center">
        <CardDisplay 
          cardRef={cardRef}
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate}
          includeDirective={includeDirective}
          includeMedical={includeMedical}
          directiveCode={directiveCode}
          medicalCode={medicalCode}
        />
        
        <CardActions 
          onDownload={handleDownload}
          onPrint={handlePrint}
          disabled={!includeDirective && !includeMedical || !isCardReady}
        />
        
        {!isCardReady && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <p>Génération des codes d'accès en cours... Veuillez patienter ou rafraîchir la page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessCard;
