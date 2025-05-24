
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { InstitutionAccessFormSimple } from "@/components/institution-access/InstitutionAccessFormSimple";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function InstitutionAccessSimple() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <BackButton 
            className="mb-6" 
            label="Retour à l'accueil"
            onClick={() => window.location.href = '/'}
          />
          
          {/* En-tête avec informations de sécurité */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Accès Professionnel Sécurisé</strong><br />
              Cette interface est réservée aux professionnels de santé autorisés.
              Toutes les consultations sont tracées et sécurisées.
            </AlertDescription>
          </Alert>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <CardTitle className="text-2xl font-bold">
                Accès Institution Standard
              </CardTitle>
              <p className="text-blue-100 mt-2">
                Accès sécurisé aux directives anticipées avec vérification d'identité
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <InstitutionAccessFormSimple />
            </CardContent>
            
            <CardFooter className="bg-gray-50 text-center text-sm text-muted-foreground border-t">
              <div className="w-full">
                <p className="mb-2">
                  <strong>Accès standard</strong> - Vérification complète de l'identité du patient
                </p>
                <p className="text-xs">
                  Conforme aux exigences de sécurité et de traçabilité des établissements de santé
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Informations complémentaires */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">✓ Sécurité</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Vérification d'identité complète</li>
                  <li>• Double authentification</li>
                  <li>• Traçabilité totale</li>
                  <li>• Accès temporaire</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-2">ℹ Informations</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Nom, prénom et date requis</li>
                  <li>• Code fourni par le patient</li>
                  <li>• Validité temporaire</li>
                  <li>• Support 24h/24</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
