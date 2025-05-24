
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Key } from "lucide-react";
import { useSimpleAccess, SimpleAccessFormData } from "@/hooks/access/institution/useSimpleAccess";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SimpleAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useSimpleAccess();
  
  const [form, setForm] = useState<SimpleAccessFormData>({
    accessCode: "9E5CUV7X" // Code de test pré-rempli
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Soumission formulaire simple:", form);
    
    const validationResult = await validateAccess(form);
    
    if (validationResult.success && validationResult.patientData) {
      // Créer un dossier pour le store
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
            date_naissance: validationResult.patientData.birth_date
          },
          documents: validationResult.patientData.directives || []
        }
      };
      
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: validationResult.message
      });
      
      navigate("/mes-directives");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Information */}
      <Alert className="bg-blue-50 border-blue-200">
        <Key className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès simplifié</strong><br />
          Saisissez uniquement le code d'accès fourni par le patient.
        </AlertDescription>
      </Alert>

      {/* Code de test */}
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          <strong>Code de test :</strong> 9E5CUV7X
        </AlertDescription>
      </Alert>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessCode">Code d'accès</Label>
          <Input
            id="accessCode"
            name="accessCode"
            value={form.accessCode}
            onChange={handleChange}
            placeholder="Saisissez le code d'accès"
            className="text-center text-lg tracking-widest font-mono"
            required
          />
          <p className="text-xs text-gray-500 text-center">
            Code à 8 caractères fourni par le patient
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Vérification..." : "Accéder aux directives"}
        </Button>
      </form>

      {/* Résultat */}
      {result && (
        <Alert variant={result.success ? "default" : "destructive"} 
               className={result.success ? "bg-green-50 border-green-200" : ""}>
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : ""}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
