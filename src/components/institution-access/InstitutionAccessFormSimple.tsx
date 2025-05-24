
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

export const InstitutionAccessFormSimple = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useInstitutionAccessSimple();
  
  const [form, setForm] = useState<InstitutionAccessFormValues>({
    lastName: "AREZKI", // Données de test pré-remplies
    firstName: "FARID",
    birthDate: "1963-08-13",
    institutionCode: "9E5CUV7X"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Formulaire: Soumission avec:", form);
    
    const validationResult = await validateAccess(form);
    
    if (validationResult.success && validationResult.directiveData) {
      console.log("Formulaire: Succès, redirection vers mes-directives");
      
      // Créer un dossier simplifié pour le store
      const dossier = {
        id: `institution-${validationResult.directiveData.user_id}`,
        contenu_dossier: {
          patient: {
            nom: validationResult.directiveData.last_name,
            prenom: validationResult.directiveData.first_name,
            date_naissance: validationResult.directiveData.birth_date
          },
          directives: validationResult.directiveData.directives,
          access_type: "institution"
        },
        cree_le: new Date().toISOString()
      };
      
      // Mettre à jour le store
      setDossierActif(dossier);
      
      // Toast de succès
      toast({
        title: "Accès autorisé",
        description: validationResult.message
      });
      
      // Rediriger vers mes-directives
      navigate("/mes-directives");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Informations sur l'accès institution */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès professionnel de santé</strong><br />
          Saisissez les informations du patient et le code d'accès institution pour consulter ses directives anticipées.
        </AlertDescription>
      </Alert>

      {/* Données de test */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Test disponible :</strong><br />
          AREZKI FARID, né le 13/08/1963<br />
          Code : 9E5CUV7X
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
          <Label htmlFor="institutionCode">Code d'accès institution</Label>
          <Input
            id="institutionCode"
            name="institutionCode"
            value={form.institutionCode}
            onChange={handleChange}
            placeholder="Code d'accès"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Vérification en cours..." : "Accéder aux directives"}
        </Button>
      </form>

      {/* Affichage du résultat */}
      {result && (
        <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "bg-green-50 border-green-200" : ""}>
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
