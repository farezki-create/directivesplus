
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, Heart, Activity } from "lucide-react";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";
import ChatAssistant from "@/components/ChatAssistant";
import { Link } from "react-router-dom";

const AccesInstitution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Professionnel
            </h1>
            <p className="text-lg text-gray-600">
              Interface sécurisée pour les professionnels de santé
            </p>
          </div>

          {/* Section Directives Anticipées */}
          <Card className="mb-6">
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

          {/* Section Dossier Soins Palliatifs */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Dossier Soins Palliatifs
              </CardTitle>
              <CardDescription>
                Accès au suivi de symptômes des patients en soins palliatifs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Consultez en temps réel l'évolution des symptômes de vos patients 
                grâce à leur code de partage personnel.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <Activity className="h-6 w-6 text-pink-600 flex-shrink-0" />
                <div className="flex-grow">
                  <h4 className="font-medium text-pink-800">Suivi des symptômes</h4>
                  <p className="text-sm text-pink-700">
                    Douleur, dyspnée, anxiété - Graphiques d'évolution
                  </p>
                </div>
                <Link to="/partage/suivi">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-pink-600 text-pink-600 hover:bg-pink-100"
                  >
                    Accéder
                  </Button>
                </Link>
              </div>

              <Alert className="border-pink-200 bg-pink-50">
                <Heart className="h-4 w-4 text-pink-600" />
                <AlertDescription className="text-pink-800">
                  <strong>Code de partage requis :</strong> Demandez à votre patient son code 
                  personnel de partage des symptômes pour accéder à son suivi.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          {/* Section Questionnaire */}
          <div className="mt-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">
                  Votre avis nous intéresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  En tant que professionnel de santé, votre retour d'expérience est précieux pour améliorer notre plateforme.
                </p>
                <Button 
                  asChild
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-100"
                >
                  <a 
                    href="https://framaforms.org/questionnaire-sur-lapplication-de-redaction-des-directives-anticipees-directivesplus-1746994695" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Répondre au questionnaire
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Informations de sécurité */}
          <div className="mt-8">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Sécurité et confidentialité :</strong> Cet accès est sécurisé et tracé. 
                Seuls les professionnels de santé autorisés peuvent consulter les données 
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
      
      <ChatAssistant />
    </div>
  );
};

export default AccesInstitution;
