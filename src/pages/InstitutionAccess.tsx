
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BackButton from "@/components/ui/back-button";
import { Construction, Wrench, HardHat } from "lucide-react";

export default function InstitutionAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto text-center">
          <BackButton 
            className="mb-8" 
            label="Retour à l'accueil"
            onClick={() => window.location.href = '/'}
          />
          
          {/* Image de chantier */}
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Chantier en cours" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Construction className="h-8 w-8 text-orange-600" />
                <CardTitle className="text-2xl font-bold text-orange-800">
                  Accès Professionnel en Développement
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert className="border-orange-300 bg-orange-100">
                <HardHat className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800 font-medium">
                  Cette fonctionnalité est actuellement en cours de développement.
                </AlertDescription>
              </Alert>
              
              <div className="text-gray-700 space-y-4">
                <p className="text-lg">
                  L'accès professionnel pour les institutions de santé sera bientôt disponible.
                </p>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Fonctionnalités à venir :</h3>
                  </div>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• Accès sécurisé avec validation d'identité complète</li>
                    <li>• Vérification nom, prénom, date de naissance</li>
                    <li>• Codes d'accès institution</li>
                    <li>• Journalisation des accès</li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  Nous travaillons activement sur cette fonctionnalité pour vous offrir 
                  un accès professionnel sécurisé et conforme aux réglementations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
