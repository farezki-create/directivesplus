
import React from "react";
import { FileText, Activity, Link } from "lucide-react";
import { formatDate } from "./utils/cardOperations";

interface CardDisplayProps {
  cardRef: React.RefObject<HTMLDivElement>;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string;
  medicalCode?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  cardRef,
  firstName,
  lastName,
  birthDate,
  includeDirective,
  includeMedical,
  directiveCode,
  medicalCode
}) => {
  return (
    <div 
      ref={cardRef} 
      className="w-[340px] h-[240px] rounded-xl bg-gradient-to-r from-directiveplus-600 to-directiveplus-700 text-white shadow-lg overflow-hidden"
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">DirectivesPlus</h3>
              <p className="text-xs opacity-75">Carte d'accès personnelle</p>
            </div>
            <img 
              src="/lovable-uploads/abf0ddf7-3dc9-4888-a686-76305831172b.png" 
              alt="Logo" 
              className="w-10 h-10"
            />
          </div>
          
          <div className="mt-4 mb-2">
            <p className="font-semibold uppercase">{lastName} {firstName}</p>
            <p className="text-xs opacity-80">Né(e) le: {formatDate(birthDate)}</p>
          </div>
        </div>
        
        <div className="space-y-1.5 mb-1">
          {includeDirective && directiveCode && (
            <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
              <FileText size={16} className="shrink-0" />
              <div>
                <p className="text-xs font-semibold">Directives anticipées:</p>
                <p className="font-mono font-bold tracking-wider text-sm">{directiveCode}</p>
              </div>
            </div>
          )}
          
          {includeMedical && medicalCode && (
            <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
              <Activity size={16} className="shrink-0" />
              <div>
                <p className="text-xs font-semibold">Données médicales:</p>
                <p className="font-mono font-bold tracking-wider text-sm">{medicalCode}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
            <Link size={16} className="shrink-0" />
            <div>
              <p className="text-xs font-semibold">Site web:</p>
              <p className="font-mono font-bold tracking-wider text-sm">directivesplus.fr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
