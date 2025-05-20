
import { FC, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AccessCodeDisplayProps {
  accessCode: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  type: "directive" | "medical";
}

const AccessCodeDisplay: FC<AccessCodeDisplayProps> = ({
  accessCode,
  firstName,
  lastName,
  birthDate,
  type
}) => {
  useEffect(() => {
    console.log("AccessCodeDisplay rendered:", { 
      type, 
      accessCode,
      firstName, 
      lastName
    });
  }, [accessCode, firstName, lastName, birthDate, type]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode).then(
      () => {
        toast({
          title: "Code copié",
          description: "Le code d'accès a été copié dans le presse-papiers"
        });
      },
      (err) => {
        console.error('Erreur lors de la copie:', err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le code d'accès",
          variant: "destructive"
        });
      }
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  if (!accessCode) {
    console.warn("AccessCodeDisplay - No access code provided!");
    return (
      <Card className="mb-8 bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p>Le code d'accès n'est pas disponible. Veuillez recharger la page ou contacter le support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-sky-50 border-sky-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-sky-800">
              Accès sans connexion pour {type === "directive" ? "les directives anticipées" : "les données médicales"}
            </h3>
            <p className="text-sm text-sky-600 mt-1">
              Les professionnels de santé peuvent accéder à {type === "directive" ? "vos directives" : "vos données médicales"} avec les informations suivantes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Nom</div>
              <div className="font-medium">{lastName || "Non renseigné"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Prénom</div>
              <div className="font-medium">{firstName || "Non renseigné"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Date de naissance</div>
              <div className="font-medium">{formatDate(birthDate) || "Non renseignée"}</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md border border-sky-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">Code d'accès unique</div>
              <div className="text-lg font-bold tracking-wider">{accessCode}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopyCode}
            >
              <Copy size={16} />
              Copier
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Ce code est nécessaire pour l'accès hors connexion. Partagez-le uniquement avec les professionnels de santé concernés.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodeDisplay;
