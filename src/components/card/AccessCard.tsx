
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import { useCardOperations } from "@/hooks/useCardOperations";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  
  // Simplified state - no automatic generation
  const [includeDirective, setIncludeDirective] = React.useState<boolean>(true);
  const [includeMedical, setIncludeMedical] = React.useState<boolean>(true);

  // Simplified card operations without automatic generation
  const {
    cardRef
  } = useCardOperations(
    user,
    firstName,
    lastName,
    includeDirective,
    includeMedical,
    null, // No directiveCode
    null  // No medicalCode
  );

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
          directiveCode={null}
          medicalCode={null}
          websiteUrl="directivesplus.fr"
        />
      </div>
    </div>
  );
};

export default AccessCard;
