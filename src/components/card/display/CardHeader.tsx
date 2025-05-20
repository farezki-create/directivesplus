
import React from "react";

interface CardHeaderProps {
  lastName: string;
  firstName: string;
  birthDate: string | null;
}

const CardHeader: React.FC<CardHeaderProps> = ({ lastName, firstName, birthDate }) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">DirectivesPlus</h3>
          <p className="text-xs opacity-75">Carte d'accès personnelle</p>
        </div>
        <img 
          src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" 
          alt="Logo" 
          className="w-10 h-10"
        />
      </div>
      
      <div className="mt-4 mb-2">
        <p className="font-semibold uppercase">{lastName} {firstName}</p>
        <p className="text-xs opacity-80">Né(e) le: {birthDate}</p>
      </div>
    </div>
  );
};

export default CardHeader;
