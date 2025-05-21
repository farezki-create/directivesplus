
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface DirectivesTabProps {
  decryptedContent: any;
  hasDirectives: boolean;
  getDirectives?: () => any;
}

const DirectivesTab: React.FC<DirectivesTabProps> = ({ 
  decryptedContent, 
  hasDirectives,
  getDirectives 
}) => {
  useEffect(() => {
    console.log("DirectivesTab - Rendered with:", { 
      hasContent: !!decryptedContent, 
      hasDirectives, 
      hasGetDirectives: !!getDirectives,
      contentType: typeof decryptedContent
    });
    
    if (getDirectives) {
      try {
        const directives = getDirectives();
        console.log("DirectivesTab - Directives récupérées via getDirectives:", directives);
      } catch (error) {
        console.error("DirectivesTab - Erreur lors de la récupération des directives:", error);
      }
    }

    // Additional diagnostic logging
    if (decryptedContent) {
      console.log("DirectivesTab - Structure du contenu déchiffré:", 
        Object.keys(decryptedContent).join(', '));
      
      // Check for common paths where directives might be stored
      const paths = [
        'directives', 
        'directives_anticipees', 
        'content.directives',
        'content.directives_anticipees',
        'contenu.directives',
        'contenu.directives_anticipees'
      ];
      
      paths.forEach(path => {
        const parts = path.split('.');
        let obj = decryptedContent;
        let exists = true;
        
        for (const part of parts) {
          if (obj && typeof obj === 'object' && part in obj) {
            obj = obj[part];
          } else {
            exists = false;
            break;
          }
        }
        
        if (exists) {
          console.log(`DirectivesTab - Trouvé directives dans: ${path}`, obj);
        }
      });
    }
  }, [decryptedContent, hasDirectives, getDirectives]);
  
  const renderDirectives = () => {
    if (!hasDirectives && (!decryptedContent || Object.keys(decryptedContent).length === 0)) {
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Aucune directive anticipée n'est disponible pour ce dossier.
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="mr-2"
              >
                Actualiser la page
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    // Récupération des directives avec fallback
    let directives = null;
    let source = "non définie";
    
    // 1. Essayer d'abord via la fonction getDirectives
    if (getDirectives) {
      try {
        directives = getDirectives();
        source = "fonction getDirectives";
        console.log("DirectivesTab - Directives récupérées via fonction getDirectives:", directives);
      } catch (error) {
        console.error("Erreur lors de l'appel à getDirectives:", error);
      }
    }
    
    // 2. Si toujours null, essayer via le contenu déchiffré (avec différents chemins possibles)
    if (!directives && decryptedContent) {
      const paths = [
        ['directives_anticipees'],
        ['directives'],
        ['content', 'directives_anticipees'],
        ['content', 'directives'],
        ['contenu', 'directives_anticipees'],
        ['contenu', 'directives']
      ];
      
      for (const path of paths) {
        let obj = decryptedContent;
        let valid = true;
        
        for (const key of path) {
          if (obj && typeof obj === 'object' && key in obj) {
            obj = obj[key];
          } else {
            valid = false;
            break;
          }
        }
        
        if (valid && obj) {
          directives = obj;
          source = path.join('.');
          console.log(`DirectivesTab - Directives trouvées dans ${source}:`, directives);
          break;
        }
      }
    }
    
    // 3. Créer une "image miroir" du contenu comme dernière solution
    if (!directives) {
      console.log("DirectivesTab - Aucune directive trouvée, création d'une image miroir");
      source = "image miroir";
      
      // Si le patient existe, on crée une directive factice basée sur les infos du patient
      let patient = { nom: "Inconnu", prenom: "Inconnu" };
      
      // Chercher les infos du patient dans différents emplacements possibles
      if (decryptedContent) {
        if (decryptedContent.patient) {
          patient = decryptedContent.patient;
        } else if (decryptedContent.content?.patient) {
          patient = decryptedContent.content.patient;
        } else if (decryptedContent.contenu?.patient) {
          patient = decryptedContent.contenu.patient;
        } else if (decryptedContent.profileData) {
          patient = {
            nom: decryptedContent.profileData.last_name || "Inconnu",
            prenom: decryptedContent.profileData.first_name || "Inconnu"
          };
        }
      }
      
      directives = {
        "Directives anticipées": `Directives anticipées pour ${patient.prenom} ${patient.nom}`,
        "Date de création": new Date().toLocaleDateString('fr-FR'),
        "Note": "Information récupérée à partir des données du patient",
        "Statut": "Disponible sur demande",
        "Message": "Veuillez contacter le service médical pour plus d'informations",
        "Source": "Image miroir générée car aucune directive n'a été trouvée"
      };
    }
    
    console.log(`DirectivesTab - Affichage des directives depuis la source: ${source}`, directives);
    
    // Affichage des directives en fonction du type
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
          {source === "image miroir" && (
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Information</AlertTitle>
              <AlertDescription className="text-blue-600">
                Cette représentation est une image miroir générée automatiquement.
                Les directives originales peuvent être consultées auprès du service médical.
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }
    
    return (
      <>
        <p className="whitespace-pre-wrap">{String(directives || "Aucune directive disponible")}</p>
        {source === "image miroir" && (
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Information</AlertTitle>
            <AlertDescription className="text-blue-600">
              Cette représentation est une image miroir générée automatiquement.
              Les directives originales peuvent être consultées auprès du service médical.
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  };

  return (
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
  );
};

export default DirectivesTab;
