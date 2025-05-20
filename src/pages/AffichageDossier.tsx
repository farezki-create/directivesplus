
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/ui/back-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AffichageDossier = () => {
  const { dossierActif, clearDossierActif } = useDossierStore();
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

  const handleFermerDossier = () => {
    clearDossierActif();
    toast({
      title: "Dossier fermé",
      description: "Le dossier médical a été fermé avec succès"
    });
    navigate('/acces-document');
  };

  if (!dossierActif) {
    return null;
  }

  // Fonction pour afficher les données structurées
  const renderDonneesMedicales = (contenu: any) => {
    if (!contenu) return <p>Aucune donnée disponible.</p>;
    
    // Si c'est un objet JSON
    if (typeof contenu === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(contenu).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <h3 className="font-medium text-gray-700">{key}</h3>
              <div className="mt-1 text-gray-600">
                {typeof value === 'object' 
                  ? <pre className="bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                  : String(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Si c'est du texte
    return <p className="whitespace-pre-wrap">{String(contenu)}</p>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleFermerDossier}
          >
            <LogOut size={16} />
            Fermer le dossier
          </Button>
        </div>
        
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
              <CardTitle>Informations du Dossier</CardTitle>
            </CardHeader>
            
            <CardContent>
              {renderDonneesMedicales(dossierActif.contenu)}
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
