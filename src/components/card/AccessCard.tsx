
import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode } from "@/hooks/useAccessCode";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import { downloadCard, printCard } from "./utils/cardOperations";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  const { accessCode: directiveCode, regenerateAccessCode: regenerateDirectiveCode, isLoading: isLoadingDirective } = useAccessCode(user, "directive");
  const { accessCode: medicalCode, regenerateAccessCode: regenerateMedicalCode, isLoading: isLoadingMedical } = useAccessCode(user, "medical");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [includeDirective, setIncludeDirective] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);
  
  const handleDownload = async () => {
    if (!user) return;
    
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
    if (!user) return;
    
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
        
        {/* Ajout des boutons de régénération de codes */}
        <div className="mt-6 mb-4 flex flex-wrap gap-4 justify-center">
          {includeDirective && (
            <Button 
              onClick={regenerateDirectiveCode}
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoadingDirective}
            >
              <RefreshCcw size={16} className={isLoadingDirective ? "animate-spin" : ""} />
              {isLoadingDirective ? "Régénération..." : "Régénérer code directives"}
            </Button>
          )}
          
          {includeMedical && (
            <Button 
              onClick={regenerateMedicalCode}
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoadingMedical}
            >
              <RefreshCcw size={16} className={isLoadingMedical ? "animate-spin" : ""} />
              {isLoadingMedical ? "Régénération..." : "Régénérer code médical"}
            </Button>
          )}
        </div>
        
        <CardActions 
          onDownload={handleDownload}
          onPrint={handlePrint}
          disabled={!includeDirective && !includeMedical}
        />
      </div>
    </div>
  );
};

export default AccessCard;
