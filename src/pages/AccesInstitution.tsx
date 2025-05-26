
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

const AccesInstitution = () => {
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
              Interface sécurisée pour les professionnels de santé
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Accès Institution - Directives Anticipées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InstitutionAccessFormComplete />
            </CardContent>
          </Card>
          
          {/* Informations de sécurité */}
          <div className="mt-8">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Sécurité et confidentialité :</strong> Cet accès est sécurisé et tracé. 
                Seuls les professionnels de santé autorisés peuvent consulter les directives 
                avec le consentement du patient via son code d'accès personnel.
              </AlertDescription>
            </Alert>
          </div>
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
