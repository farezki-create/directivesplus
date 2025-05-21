
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/ui/back-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogOut, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decryptData } from "@/utils/encryption";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logAccessEvent } from "@/utils/accessLoggingUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AffichageDossier = () => {
  const { dossierActif, clearDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const [decryptedContent, setDecryptedContent] = useState<any>(null);
  const [decryptionError, setDecryptionError] = useState<boolean>(false);
  
  // Effet pour déchiffrer et afficher les données
  useEffect(() => {
    // Rediriger vers la page d'accès si aucun dossier n'est actif
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Veuillez saisir un code d'accès valide",
        variant: "destructive"
      });
      navigate('/acces-document');
    } else {
      // Tenter de déchiffrer le contenu
      try {
        // Vérifier si le contenu est chiffré (commence par "U2F")
        if (typeof dossierActif.contenu === 'string' && dossierActif.contenu.startsWith('U2F')) {
          const decrypted = decryptData(dossierActif.contenu);
          setDecryptedContent(decrypted);
          console.log("Données déchiffrées avec succès");
        } else {
          // Si les données ne sont pas chiffrées (rétrocompatibilité)
          setDecryptedContent(dossierActif.contenu);
          console.log("Données non chiffrées utilisées directement");
        }

        // Journaliser la visualisation du dossier
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000', // Utilisateur anonyme
          accessCodeId: dossierActif.id,
          resourceType: "dossier",
          resourceId: dossierActif.id,
          action: "view",
          success: true
        });
      } catch (error) {
        console.error("Erreur de déchiffrement:", error);
        setDecryptionError(true);
        toast({
          title: "Erreur de déchiffrement",
          description: "Impossible de déchiffrer les données du dossier",
          variant: "destructive"
        });

        // Journaliser l'erreur de déchiffrement
        logAccessEvent({
          userId: '00000000-0000-0000-0000-000000000000',
          accessCodeId: dossierActif.id,
          resourceType: "dossier",
          resourceId: dossierActif.id,
          action: "attempt",
          success: false
        });
      }
    }
  }, [dossierActif, navigate]);

  // Effets pour gérer la sécurité de la session
  useEffect(() => {
    // Définir un délai d'inactivité
    const inactivityTimeout = setTimeout(() => {
      if (dossierActif) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré pour des raisons de sécurité",
          variant: "default"
        });
        handleFermerDossier();
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    // Écouter les événements utilisateur pour réinitialiser le délai d'inactivité
    const resetTimeout = () => {
      clearTimeout(inactivityTimeout);
    };
    
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    
    // Nettoyage à la destruction du composant
    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
    };
  }, [dossierActif]);

  const handleFermerDossier = () => {
    // Journaliser la fermeture du dossier si disponible
    if (dossierActif) {
      logAccessEvent({
        userId: '00000000-0000-0000-0000-000000000000',
        accessCodeId: dossierActif.id,
        resourceType: "dossier",
        resourceId: dossierActif.id,
        action: "access",
        success: true
      });
    }
    
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

  // Vérifier la présence des directives anticipées dans le contenu déchiffré
  const hasDirectives = decryptedContent && 
    typeof decryptedContent === 'object' && 
    decryptedContent.directives_anticipees;

  // Extraire les informations patient si disponibles
  const patientInfo = decryptedContent && 
    typeof decryptedContent === 'object' && 
    decryptedContent.patient;

  // Fonction pour afficher les données structurées
  const renderDonneesMedicales = (contenu: any) => {
    if (!contenu) return <p>Aucune donnée disponible.</p>;
    
    if (decryptionError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de déchiffrement</AlertTitle>
          <AlertDescription>
            Impossible de déchiffrer les données du dossier. Le format ou la clé de déchiffrement pourrait être invalide.
          </AlertDescription>
        </Alert>
      );
    }

    // Filtrer les données médicales (exclure les directives anticipées pour cette section)
    const medicalData = { ...contenu };
    if (medicalData.directives_anticipees) {
      delete medicalData.directives_anticipees;
    }
    
    // Si c'est un objet JSON
    if (typeof medicalData === 'object' && Object.keys(medicalData).length > 0) {
      return (
        <div className="space-y-4">
          {Object.entries(medicalData).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <h3 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h3>
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
    
    // Si c'est du texte ou s'il n'y a pas de données médicales
    return <p className="whitespace-pre-wrap">{typeof medicalData === 'string' ? medicalData : "Aucune donnée médicale disponible."}</p>;
  };

  // Fonction spécifique pour afficher les directives anticipées
  const renderDirectives = () => {
    if (!hasDirectives) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Aucune directive anticipée n'est disponible pour ce dossier.
          </AlertDescription>
        </Alert>
      );
    }

    const directives = decryptedContent.directives_anticipees;
    
    if (typeof directives === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(directives).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <h3 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h3>
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
    
    return <p className="whitespace-pre-wrap">{String(directives)}</p>;
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
          
          {patientInfo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Informations du patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientInfo.nom && (
                    <div>
                      <span className="font-medium">Nom:</span> {patientInfo.nom}
                    </div>
                  )}
                  {patientInfo.prenom && (
                    <div>
                      <span className="font-medium">Prénom:</span> {patientInfo.prenom}
                    </div>
                  )}
                  {patientInfo.date_naissance && (
                    <div>
                      <span className="font-medium">Date de naissance:</span> {patientInfo.date_naissance}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription className="flex items-center">
              <span>Vous consultez le dossier médical avec l'identifiant {dossierActif.id}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShieldCheck className="h-4 w-4 ml-2 text-green-600" />
                  </TooltipTrigger>
                  <TooltipContent>Données chiffrées</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="dossier" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="dossier">Données médicales</TabsTrigger>
              <TabsTrigger value="directives" className="flex items-center gap-1">
                <FileText size={16} />
                Directives anticipées
                {hasDirectives && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 ml-1 rounded-full">
                    Disponible
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dossier">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Informations Médicales</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldCheck size={18} className="text-green-600" />
                        </TooltipTrigger>
                        <TooltipContent>Données chiffrées</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderDonneesMedicales(decryptedContent)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="directives">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Directives Anticipées</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FileText size={18} className="text-blue-600" />
                        </TooltipTrigger>
                        <TooltipContent>Directives du patient</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderDirectives()}
                </CardContent>
              </Card>
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

export default AffichageDossier;
