
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useInstitutionAccess, InstitutionFormData } from "@/hooks/access/institution/useInstitutionAccess";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const InstitutionAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useInstitutionAccess();
  
  const [form, setForm] = useState<InstitutionFormData>({
    lastName: "AREZKI",
    firstName: "FARID", 
    birthDate: "1963-08-13",
    institutionCode: "9E5CUV7X" // Code corrigé
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== SOUMISSION FORMULAIRE ===");
    console.log("Données du formulaire:", form);
    
    const validationResult = await validateAccess(form);
    
    console.log("Résultat de validation:", validationResult);
    
    if (validationResult.success && validationResult.patientData) {
      // Créer un dossier pour le store conforme au type Dossier
      const dossier = {
        id: `institution-${validationResult.patientData.user_id}`,
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
      
      console.log("Dossier créé:", dossier);
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: validationResult.message
      });
      
      navigate("/mes-directives");
    } else {
      console.error("Échec de validation:", validationResult.message);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Info accès professionnel */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès professionnel de santé</strong><br />
          Saisissez les informations exactes du patient et le code d'accès institution.
        </AlertDescription>
      </Alert>

      {/* Données de test */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Test disponible :</strong><br />
          Nom: AREZKI, Prénom: FARID<br />
          Date: 1963-08-13, Code: 9E5CUV7X
        </AlertDescription>
      </Alert>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom de famille</Label>
          <Input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="NOM (sensible à la casse)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Prénom (sensible à la casse)"
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
          <p className="text-xs text-gray-500">Format: YYYY-MM-DD</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionCode">Code d'accès institution</Label>
          <Input
            id="institutionCode"
            name="institutionCode"
            value={form.institutionCode}
            onChange={handleChange}
            placeholder="Code à 8 caractères"
            className="text-center font-mono tracking-widest"
            maxLength={8}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Vérification..." : "Accéder aux directives"}
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
                Directives trouvées : {result.patientData.directives?.length || 0}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions d'utilisation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Saisissez le nom de famille exactement comme enregistré</li>
          <li>• Saisissez le prénom exactement comme enregistré</li>
          <li>• Utilisez le format de date YYYY-MM-DD</li>
          <li>• Le code d'accès est sensible à la casse</li>
        </ul>
      </div>
    </div>
  );
};
