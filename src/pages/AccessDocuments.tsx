
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Activity } from "lucide-react";

const AccessDocuments = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Auth state tracked
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-directiveplus-800 text-center mb-8">
            Accéder à un document
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-directiveplus-100 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-directiveplus-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Directives anticipées</h2>
                  <p className="text-gray-600 mb-6">
                    Consultez des directives anticipées avec le code d'accès fourni par leur titulaire.
                    {isAuthenticated && " Ou accédez directement à vos propres directives."}
                  </p>
                  
                  <Link to="/acces-directives" className="w-full">
                    <Button className="w-full bg-directiveplus-600 hover:bg-directiveplus-700">
                      {isAuthenticated 
                        ? "Consulter vos directives ou saisir un code" 
                        : "Saisir un code d'accès"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Données médicales</h2>
                  <p className="text-gray-600 mb-6">
                    Accédez aux données médicales d'un patient avec le code d'accès qu'il vous a fourni.
                    {isAuthenticated && " Ou consultez directement vos propres données médicales."}
                  </p>
                  
                  <Link to="/acces-medical" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      {isAuthenticated 
                        ? "Consulter vos données ou saisir un code" 
                        : "Saisir un code d'accès"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {isAuthenticated && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-center text-green-800">
                Vous êtes connecté. Vous pouvez accéder directement à vos directives et données médicales en cliquant sur les boutons ci-dessus.
              </p>
            </div>
          )}
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Comment ça fonctionne ?</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Demandez un code d'accès au titulaire des directives ou au patient</li>
              <li>Choisissez le type de document auquel vous souhaitez accéder</li>
              <li>Saisissez le code et les informations d'identification demandées</li>
              <li>Consultez le document en toute sécurité</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessDocuments;
