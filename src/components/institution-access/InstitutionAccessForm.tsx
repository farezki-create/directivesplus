
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useUnifiedAccessCode } from "@/hooks/useUnifiedAccessCode";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export interface InstitutionFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const InstitutionAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { validateCode, isValidating } = useUnifiedAccessCode();
  const [result, setResult] = useState<any>(null);
  
  const [form, setForm] = useState<InstitutionFormData>({
    lastName: "",
    firstName: "", 
    birthDate: "",
    institutionCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== SOUMISSION FORMULAIRE INSTITUTION ===");
    console.log("Données du formulaire:", form);
    
    const validationResult = await validateCode(form.institutionCode, {
      firstName: form.firstName,
      lastName: form.lastName,
      birthDate: form.birthDate
    });
    
    console.log("Résultat de validation:", validationResult);
    setResult(validationResult);
    
    if (validationResult.success && validationResult.documents) {
      // Créer un dossier pour le store
      const dossier = {
        id: `institution-${validationResult.documents[0]?.user_id || 'unknown'}`,
        userId: validationResult.documents[0]?.user_id || '',
        isFullAccess: true,
        isDirectivesOnly: false,
        isMedicalOnly: false,
        profileData: {
          first_name: form.firstName,
          last_name: form.lastName,
          birth_date: form.birthDate
        },
        contenu: {
          patient: {
            nom: form.lastName,
            prenom: form.firstName,
            date_naissance: form.birthDate
          },
          documents: validationResult.documents || []
        }
      };
      
      console.log("Dossier créé:", dossier);
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: "Accès aux directives autorisé"
      });
      
      navigate("/mes-directives");
    } else {
      console.error("Échec de validation:", validationResult.error);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Info accès professionnel */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès professionnel de santé</strong><br />
          Saisissez les informations exactes du patient et le code d'accès partagé.
        </AlertDescription>
      </Alert>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille du patient</Label>
          <Input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="NOM"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom du patient</Label>
          <Input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Prénom"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionCode">Code d'accès partagé</Label>
          <Input
            id="institutionCode"
            name="institutionCode"
            value={form.institutionCode}
            onChange={handleChange}
            placeholder="Code d'accès (8 caractères)"
            maxLength={8}
            required
          />
          <p className="text-xs text-gray-500">
            Code généré par le patient pour l'accès professionnel
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isValidating}
        >
          {isValidating ? "Vérification..." : "Accéder aux directives"}
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
            {result.error || result.message}
            {result.success && result.documents && (
              <div className="mt-2 text-sm">
                Documents trouvés : {result.documents.length}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Informations de sécurité */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Sécurité :</strong> Les accès sont journalisés pour des raisons de traçabilité et de sécurité.
        </AlertDescription>
      </Alert>
    </div>
  );
};
