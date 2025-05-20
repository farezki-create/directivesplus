
import { useEffect } from "react";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/ui/back-button";
import { FileText, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AccessDocuments = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Page de choix d'accès aux documents chargée");
    console.log("État d'authentification:", isAuthenticated ? "Connecté" : "Non connecté");
    
    toast({
      title: "Accès aux documents",
      description: "Choisissez le type de document auquel vous souhaitez accéder"
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <BackButton />
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Accès aux documents
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Directives anticipées */}
            <Card className="shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-directiveplus-700 flex items-center gap-2">
                  <FileText />
                  Directives anticipées
                </CardTitle>
                <CardDescription>
                  Accédez aux directives anticipées d'un patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Consultez les volontés d'un patient concernant sa fin de vie et les soins médicaux.
                </p>
                <Button
                  className="w-full bg-directiveplus-700 hover:bg-directiveplus-800"
                  onClick={() => navigate("/acces-directives")}
                >
                  Accéder aux directives
                </Button>
              </CardContent>
            </Card>
            
            {/* Données médicales */}
            <Card className="shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <FileSearch />
                  Données médicales
                </CardTitle>
                <CardDescription>
                  Accédez aux données médicales d'un patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Consultez les informations médicales importantes d'un patient pour sa prise en charge.
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate("/acces-medical")}
                  style={{ backgroundColor: '#3b82f6', color: 'white' }}
                >
                  Accéder aux données médicales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccessDocuments;
