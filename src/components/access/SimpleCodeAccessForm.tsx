
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Key, Loader2 } from "lucide-react";
import { useSimpleCodeAccess } from "@/hooks/access/useSimpleCodeAccess";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SimpleCodeAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useSimpleCodeAccess();
  
  const [accessCode, setAccessCode] = useState("TEST123"); // Code de test pré-rempli

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un code d'accès",
        variant: "destructive"
      });
      return;
    }
    
    console.log("=== SOUMISSION FORMULAIRE SIMPLE ===");
    console.log("Code saisi:", accessCode);
    
    const validationResult = await validateAccess(accessCode.trim());
    
    if (validationResult.success && validationResult.patientData) {
      console.log("=== SUCCÈS - CRÉATION DU DOSSIER ===");
      
      // Créer un dossier simple pour le store
      const dossier = {
        id: `simple-access-${validationResult.patientData.id}`,
        userId: validationResult.patientData.id,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: {
          first_name: validationResult.patientData.first_name,
          last_name: validationResult.patientData.last_name,
          birth_date: validationResult.patientData.birth_date
        },
        contenu: {
          patient: {
            nom: validationResult.patientData.last_name,
            prenom: validationResult.patientData.first_name,
            date_naissance: validationResult.patientData.birth_date
          },
          documents: validationResult.patientData.directives
        }
      };
      
      console.log("Dossier créé:", dossier);
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: validationResult.message
      });
      
      // Redirection vers la page des directives
      navigate("/mes-directives");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Information sur l'accès simplifié */}
      <Alert className="bg-blue-50 border-blue-200">
        <Key className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès par code</strong><br />
          Saisissez le code d'accès fourni par le patient ou l'institution.
        </AlertDescription>
      </Alert>

      {/* Code de test visible */}
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          <strong>Code de test disponible :</strong> TEST123<br />
          <span className="text-sm">Ce code permet de tester l'accès</span>
        </AlertDescription>
      </Alert>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="accessCode" className="text-base font-medium">
            Code d'accès
          </Label>
          <Input
            id="accessCode"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Saisissez le code d'accès"
            className="text-center text-lg tracking-widest font-mono h-12"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={loading || !accessCode.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder aux directives"
          )}
        </Button>
      </form>

      {/* Résultat de la validation */}
      {result && (
        <Alert 
          variant={result.success ? "default" : "destructive"} 
          className={result.success ? "bg-green-50 border-green-200" : ""}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : ""}>
            {result.message}
            {result.success && result.patientData && (
              <div className="mt-2 text-sm">
                Patient : {result.patientData.first_name} {result.patientData.last_name}<br />
                Date de naissance : {result.patientData.birth_date}<br />
                Directives trouvées : {result.patientData.directives.length}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions d'utilisation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Saisissez le code d'accès fourni</li>
          <li>• Le système vérifiera automatiquement la validité</li>
          <li>• Vous accéderez directement aux directives</li>
        </ul>
      </div>
    </div>
  );
};
