
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import { useCardOperations } from "@/hooks/useCardOperations";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
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
  
  // Simplified state - no automatic generation
  const [includeDirective, setIncludeDirective] = React.useState<boolean>(true);
  const [includeMedical, setIncludeMedical] = React.useState<boolean>(true);
  
  // Use the hooks to get access codes directly OR use the props passed from parent
  const hooksDirectiveCode = useAccessCode(user, "directive");
  const hooksMedicalCode = useAccessCode(user, "medical");
  
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
          disabled={!codesReady}
          codesReady={codesReady}
        />
      </div>
    </div>
  );
};

export default AccessCard;
