
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DocumentViewer: React.FC = () => {
  const { dossierActif } = useDossierStore();
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  // Vérifier que l'utilisateur a accès à ce document
  useEffect(() => {
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Vous devez accéder à un dossier médical pour visualiser ce document",
        variant: "destructive"
      });
      navigate('/acces-document');
    }
  }, [dossierActif, navigate]);

  const handleBack = () => {
    navigate('/affichage-dossier');
  };

  if (!dossierActif) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <div className="mb-6">
          <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Retour au dossier
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={24} />
              Visualisation du document
            </CardTitle>
            <CardDescription>
              Document du dossier {dossierActif.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-center text-gray-500">
                Contenu du document {documentId} associé au dossier {dossierActif.id}
              </p>
              {/* Le contenu réel du document serait chargé ici */}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DocumentViewer;
