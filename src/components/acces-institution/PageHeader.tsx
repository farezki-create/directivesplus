
import React from "react";

export const PageHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
          alt="DirectivesPlus" 
          className="h-22 sm:h-26 w-auto object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Accès Professionnel
      </h1>
      <p className="text-lg text-gray-600">
        Interface sécurisée pour les professionnels de santé
      </p>
    </div>
  );
};
