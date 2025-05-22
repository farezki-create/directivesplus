
import React, { useRef } from "react";
import CardDisplay from "./CardDisplay";
import CardOptions from "./CardOptions";
import { formatDate } from "./utils/formatters";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  directiveCode: string | null;
  medicalCode: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({
  firstName,
  lastName,
  birthDate,
  directiveCode,
  medicalCode
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="flex flex-col items-center">
      {/* Card display component */}
      <div className="mb-6">
        <CardDisplay 
          cardRef={cardRef}
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate}
          includeDirective={!!directiveCode}
          includeMedical={!!medicalCode}
          directiveCode={directiveCode}
          medicalCode={medicalCode}
        />
      </div>
      
      {/* Card options (download, print, share) */}
      <CardOptions 
        cardRef={cardRef}
        firstName={firstName}
        lastName={lastName}
      />
    </div>
  );
};

export default AccessCard;
