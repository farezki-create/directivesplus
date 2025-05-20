
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
          <h3 className="font-bold text-2xl">DirectivesPlus</h3>
          <p className="text-sm opacity-90">Carte d'accès personnelle</p>
        </div>
        <img 
          src="/lovable-uploads/2ec810a2-02f4-4490-b17d-fd70edd2a559.png" 
          alt="Logo" 
          className="w-16 h-16 object-contain bg-white rounded-md p-1"
        />
      </div>
      
      <div className="mt-6 mb-2 text-center">
        <p className="font-bold text-xl uppercase">{lastName} {firstName}</p>
        <p className="text-sm opacity-90">Né(e) le: {birthDate}</p>
      </div>
    </div>
  );
};

export default CardHeader;
