
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
              Fonctionnalité temporairement désactivée
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Service en cours de refactorisation</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Le système d'accès par codes de partage a été désactivé pour simplification.
                  Une nouvelle version plus simple sera bientôt disponible.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
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
