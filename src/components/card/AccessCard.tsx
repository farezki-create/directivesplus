
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import CardStatusMessage from "./CardStatusMessage";
import { useAccessCardGeneration } from "@/hooks/useAccessCardGeneration";
import { useCardOperations } from "@/hooks/useCardOperations";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  
  const [includeDirective, setIncludeDirective] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);

  // Use our custom hooks
  const {
    directiveCode,
    medicalCode,
    isGenerating,
    isCardReady,
    handleGenerateCard
  } = useAccessCardGeneration(user, includeDirective, includeMedical);

  // Initialize card operations
  const {
    cardRef,
    handleDownload,
    handlePrint
  } = useCardOperations(
    user,
    firstName,
    lastName,
    includeDirective,
    includeMedical,
    directiveCode,
    medicalCode
  );

  // Log the current state for debugging
  console.log("Card state:", { 
    directiveCode, 
    medicalCode, 
    isCardReady, 
    isGenerating,
    includeDirective,
    includeMedical 
  });

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
          websiteUrl="directivesplus.fr"
        />
        
        <CardActions 
          onGenerate={handleGenerateCard}
          onDownload={handleDownload}
          onPrint={handlePrint}
          disabled={(!includeDirective && !includeMedical) || isGenerating}
          isLoading={isGenerating}
        />
        
        <CardStatusMessage 
          isCardReady={isCardReady} 
          isGenerating={isGenerating} 
        />
      </div>
    </div>
  );
};

export default AccessCard;
