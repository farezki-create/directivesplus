
import React, { useEffect } from "react";
import CardHeader from "./display/CardHeader";
import CardCodeSection from "./display/CardCodeSection";
import CardFooter from "./display/CardFooter";
import { formatDate } from "./utils/formatters";

interface CardDisplayProps {
  cardRef: React.RefObject<HTMLDivElement>;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
  websiteUrl?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  cardRef,
  firstName,
  lastName,
  birthDate,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode,
  websiteUrl = "directivesplus.fr"
}) => {
  const formattedBirthDate = formatDate(birthDate);
  
  useEffect(() => {
    console.log("CardDisplay - Rendering with codes:", { 
      directiveCode,
      medicalCode,
      includeDirective,
      includeMedical
    });
  }, [directiveCode, medicalCode, includeDirective, includeMedical]);

  return (
    <div 
      ref={cardRef} 
      className="w-[340px] h-[240px] rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg overflow-hidden"
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <CardHeader 
          firstName={firstName}
          lastName={lastName}
          birthDate={formattedBirthDate}
        />
        
        <div>
          <CardCodeSection
            includeDirective={includeDirective}
            includeMedical={includeMedical}
            directiveCode={directiveCode}
            medicalCode={medicalCode}
          />
          
          <CardFooter websiteUrl={websiteUrl} />
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
