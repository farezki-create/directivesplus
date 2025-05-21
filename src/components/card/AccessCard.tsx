
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import { useCardOperations } from "@/hooks/useCardOperations";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { useAccessCardGeneration } from "@/hooks/useAccessCardGeneration";
import { downloadCard } from "./utils/downloadCard";
import { printCard } from "./utils/printCard";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  directiveCode?: string | null;
  medicalCode?: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ 
  firstName, 
  lastName, 
  birthDate,
  directiveCode: externalDirectiveCode,
  medicalCode: externalMedicalCode 
}) => {
  const { user } = useAuth();
  
  // State for code selection
  const [includeDirective, setIncludeDirective] = React.useState<boolean>(true);
  const [includeMedical, setIncludeMedical] = React.useState<boolean>(true);
  
  // Use the updated hooks to get access codes directly OR use the props passed from parent
  const { accessCode: hooksDirectiveCode, isLoading: directiveLoading } = useAccessCode(user, "directive");
  const { accessCode: hooksMedicalCode, isLoading: medicalLoading } = useAccessCode(user, "medical");
  
  // Use the generate hook for regenerating codes
  const { 
    handleGenerateCard, 
    isGenerating 
  } = useAccessCardGeneration(user, includeDirective, includeMedical);
  
  // Use external codes (from props) if provided, otherwise use hook codes
  const directiveCode = externalDirectiveCode || hooksDirectiveCode;
  const medicalCode = externalMedicalCode || hooksMedicalCode;
  
  // Check if codes are ready - consider both codes ready if they're available
  const directiveReady = !!directiveCode && includeDirective;
  const medicalReady = !!medicalCode && includeMedical;
  const codesReady = (directiveReady || medicalReady);
  
  useEffect(() => {
    console.log("AccessCard - Using codes:", { 
      directiveCode, 
      medicalCode,
      firstName,
      lastName,
      codesReady
    });
  }, [directiveCode, medicalCode, firstName, lastName, codesReady]);
  
  // Simplified card operations without automatic generation
  const { cardRef } = useCardOperations(
    user,
    firstName,
    lastName,
    includeDirective,
    includeMedical,
    directiveCode,
    medicalCode
  );

  // Handle download
  const handleDownload = () => {
    if (!user || !codesReady) return;
    
    downloadCard({
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
  
  // Handle print
  const handlePrint = () => {
    if (!user || !codesReady) return;
    
    printCard({
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

  // Handle regeneration of codes
  const handleRegenerate = () => {
    handleGenerateCard();
  };

  return (
    <div className="space-y-8">
      <CardOptions 
        includeDirective={includeDirective}
        setIncludeDirective={setIncludeDirective}
        includeMedical={includeMedical}
        setIncludeMedical={setIncludeMedical}
      />
      
      <div className="flex flex-col items-center space-y-6">
        <CardDisplay 
          cardRef={cardRef}
          firstName={firstName || ""}
          lastName={lastName || ""}
          birthDate={birthDate}
          includeDirective={includeDirective}
          includeMedical={includeMedical}
          directiveCode={directiveCode}
          medicalCode={medicalCode}
          websiteUrl="directivesplus.fr"
        />
        
        <CardActions 
          onDownload={handleDownload}
          onPrint={handlePrint}
          onGenerate={handleRegenerate}
          disabled={!codesReady}
          codesReady={codesReady}
          isGenerating={isGenerating}
          isLoading={directiveLoading || medicalLoading}
        />
      </div>
    </div>
  );
};

export default AccessCard;
