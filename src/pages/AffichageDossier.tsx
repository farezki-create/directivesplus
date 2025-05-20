
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/ui/back-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AffichageDossier = () => {
  const { dossierActif } = useDossierStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Rediriger vers la page d'accès si aucun dossier n'est actif
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Veuillez saisir un code d'accès valide",
        variant: "destructive"
      });
      navigate('/acces-document');
    }
  }, [dossierActif, navigate]);

  if (!dossierActif) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <BackButton />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Consultation du Dossier Médical
          </h1>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Vous consultez le dossier médical avec l'identifiant {dossierActif.id}
            </AlertDescription>
          </Alert>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Contenu du Dossier</CardTitle>
            </CardHeader>
            
            <CardContent>
              {dossierActif.contenu && typeof dossierActif.contenu === 'object' ? (
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[60vh]">
                  {JSON.stringify(dossierActif.contenu, null, 2)}
                </pre>
              ) : (
                <p>Le contenu du dossier n'est pas disponible au format attendu.</p>
              )}
            </CardContent>
          </Card>
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

export default AffichageDossier;
