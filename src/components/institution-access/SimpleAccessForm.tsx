
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Key, Loader2 } from "lucide-react";
import { useSimpleAccess, SimpleAccessFormData } from "@/hooks/access/institution/useSimpleAccess";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SimpleAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useSimpleAccess();
  
  const [form, setForm] = useState<SimpleAccessFormData>({
    accessCode: "LC8SVMBK" // Code généré récemment pour le test
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convertir en majuscules et supprimer les espaces
    const cleanValue = value.toUpperCase().replace(/\s/g, '');
    setForm(prev => ({ ...prev, [name]: cleanValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== DÉMARRAGE VALIDATION SIMPLE ===");
    console.log("Données du formulaire:", form);
    
    if (!form.accessCode.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un code d'accès",
        variant: "destructive"
      });
      return;
    }
    
    const validationResult = await validateAccess(form);
    
    if (validationResult.success && validationResult.patientData) {
      console.log("=== SUCCÈS - CRÉATION DU DOSSIER ===");
      
      // Créer un dossier structuré pour le store
      const dossier = {
        id: `simple-access-${validationResult.patientData.user_id}`,
        userId: validationResult.patientData.user_id,
        isFullAccess: true,
        isDirectivesOnly: false,
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
            date_naissance: validationResult.patientData.birth_date,
            // Ajout d'informations additionnelles pour compatibilité
            first_name: validationResult.patientData.first_name,
            last_name: validationResult.patientData.last_name,
            birth_date: validationResult.patientData.birth_date
          },
          documents: validationResult.patientData.directives || []
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
    } else {
      console.log("=== ÉCHEC DE LA VALIDATION ===");
      console.log("Résultat:", validationResult);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Information sur l'accès simplifié */}
      <Alert className="bg-blue-50 border-blue-200">
        <Key className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès simplifié</strong><br />
          Saisissez uniquement le code d'accès fourni par le patient.
          Interface similaire aux systèmes d'imagerie médicale.
        </AlertDescription>
      </Alert>

      {/* Code de test visible */}
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          <strong>Code de test disponible :</strong> LC8SVMBK<br />
          <span className="text-sm">Ce code permet de tester l'accès aux directives de FARID AREZKI</span>
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
            name="accessCode"
            value={form.accessCode}
            onChange={handleChange}
            placeholder="Saisissez le code d'accès"
            className="text-center text-lg tracking-widest font-mono h-12"
            maxLength={8}
            required
          />
          <p className="text-xs text-gray-500 text-center">
            Code à 8 caractères fourni par le patient
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={loading || !form.accessCode.trim()}
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
          <li>• Demandez le code d'accès au patient</li>
          <li>• Saisissez le code dans le champ ci-dessus</li>
          <li>• Le système vérifiera automatiquement la validité</li>
          <li>• Vous accéderez directement aux directives</li>
        </ul>
      </div>
    </div>
  );
};
