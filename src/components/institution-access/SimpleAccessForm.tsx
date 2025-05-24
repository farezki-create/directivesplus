
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useInstitutionAccessSimple, InstitutionAccessFormValues } from "@/hooks/access/institution/useInstitutionAccessSimple";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SimpleAccessForm = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useInstitutionAccessSimple();
  
  const [form, setForm] = useState<InstitutionAccessFormValues>({
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
    
    console.log("=== SOUMISSION FORMULAIRE SIMPLE ACCESS ===");
    console.log("Données du formulaire:", form);
    
    const validationResult = await validateAccess(form);
    
    console.log("Résultat de validation:", validationResult);
    
    if (validationResult.success && validationResult.directiveData) {
      // Créer un dossier pour le store conforme au type Dossier
      const dossier = {
        id: `institution-${validationResult.directiveData.user_id}`,
        userId: validationResult.directiveData.user_id,
        isFullAccess: true,
        isDirectivesOnly: false,
        isMedicalOnly: false,
        profileData: {
          first_name: validationResult.directiveData.first_name,
          last_name: validationResult.directiveData.last_name,
          birth_date: validationResult.directiveData.birth_date
        },
        contenu: {
          patient: {
            nom: validationResult.directiveData.last_name,
            prenom: validationResult.directiveData.first_name,
            date_naissance: validationResult.directiveData.birth_date
          },
          documents: validationResult.directiveData.directives || []
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
            {result.success && result.directiveData && (
              <div className="mt-2 text-sm">
                Patient : {result.directiveData.first_name} {result.directiveData.last_name}<br />
                Date de naissance : {result.directiveData.birth_date}<br />
                Documents trouvés : {result.directiveData.directives.length}
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
