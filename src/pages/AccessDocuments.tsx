
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileSearch } from "lucide-react";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import MedicalDataAccessForm from "@/components/access/MedicalDataAccessForm";

const AccessDocuments = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("directives");
  
  // Effet pour afficher un message d'information au chargement de la page
  useEffect(() => {
    console.log("Page d'accès aux documents chargée");
    console.log("État d'authentification:", isAuthenticated ? "Connecté" : "Non connecté");
    
    toast({
      title: "Accès aux documents",
      description: "Veuillez choisir le type de document auquel vous souhaitez accéder"
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
          Accès document
        </h1>
        
        <div className="max-w-md mx-auto">
          <Tabs 
            defaultValue="directives" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8 w-full">
              <TabsTrigger value="directives" className="flex items-center gap-2">
                <FileText size={18} />
                Directives anticipées
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <FileSearch size={18} />
                Données médicales
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="directives">
              <DirectivesAccessForm />
            </TabsContent>
            
            <TabsContent value="medical">
              <MedicalDataAccessForm />
            </TabsContent>
          </Tabs>
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
