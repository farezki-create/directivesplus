
import React, { useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import { InstitutionAccessFormSimple } from "@/components/institution-access/InstitutionAccessFormSimple";
import { AccessCodeDiagnostic } from "@/components/diagnosis/AccessCodeDiagnostic";
import { Button } from "@/components/ui/button";

const AccesInstitution = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès aux directives anticipées
            </h1>
            <p className="text-lg text-gray-600">
              Accès sécurisé pour les professionnels de santé avec vérification d'identité
            </p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDiagnostic(!showDiagnostic)}
              >
                {showDiagnostic ? "Masquer" : "Afficher"} le diagnostic
              </Button>
            </div>
          </div>
          
          {showDiagnostic ? (
            <AccessCodeDiagnostic />
          ) : (
            <InstitutionAccessFormSimple />
          )}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccesInstitution;
