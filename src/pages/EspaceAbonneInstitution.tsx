
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import ChatAssistant from "@/components/ChatAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, FileText, Heart, BarChart3, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const EspaceAbonneInstitution = () => {
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
              Espace Abonné Institution
            </h1>
            <p className="text-lg text-gray-600">
              Accès privilégié pour les établissements partenaires
            </p>
          </div>

          {/* Tableau de bord institution */}
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Tableau de Bord Institution
              </CardTitle>
              <CardDescription>
                Vue d'ensemble de vos patients autorisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Accédez directement aux patients pour lesquels votre institution 
                dispose d'autorisations d'accès aux directives anticipées.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-green-200">
                <Users className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div className="flex-grow">
                  <h4 className="font-medium text-green-800">Patients autorisés</h4>
                  <p className="text-sm text-green-700">
                    Consultez la liste complète de vos patients autorisés
                  </p>
                </div>
                <Link to="/tableau-bord-institution">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-600 text-green-600 hover:bg-green-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Accéder au tableau de bord
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Accès direct aux fonctionnalités */}
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Accès Direct aux Fonctionnalités
              </CardTitle>
              <CardDescription>
                Fonctionnalités privilégiées pour les abonnés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
                  <FileText className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-medium text-purple-800">Directives anticipées</h4>
                    <p className="text-sm text-purple-700">Accès direct aux directives patients</p>
                  </div>
                  <Link to="/acces-institution">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-600 text-purple-600 hover:bg-purple-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Accéder
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
                  <Heart className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-medium text-purple-800">Suivi palliatif</h4>
                    <p className="text-sm text-purple-700">Données symptômes en temps réel</p>
                  </div>
                  <Link to="/acces-soins-palliatifs">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-600 text-purple-600 hover:bg-purple-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Accéder
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de sécurité */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Accès sécurisé :</strong> Cet espace est réservé aux institutions 
              ayant un abonnement validé. Tous les accès sont tracés et sécurisés 
              conformément aux exigences RGPD.
            </AlertDescription>
          </Alert>
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

export default EspaceAbonneInstitution;
