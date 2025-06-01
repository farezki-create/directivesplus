
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { PalliativeCareAccessForm } from "@/components/palliative-access/PalliativeCareAccessForm";
import ChatAssistant from "@/components/ChatAssistant";

const AccesSoinsPalliatifs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Accès Dossier Soins Palliatifs
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Interface sécurisée pour accéder aux directives anticipées via le suivi palliatif
            </p>
          </div>

          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Heart className="h-5 w-5" />
                Accès au Suivi Palliatif
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PalliativeCareAccessForm />
            </CardContent>
          </Card>
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

export default AccesSoinsPalliatifs;
