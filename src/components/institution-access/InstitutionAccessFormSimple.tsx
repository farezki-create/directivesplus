
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useInstitutionAccessSimple, InstitutionAccessFormValues } from "@/hooks/access/institution/useInstitutionAccessSimple";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Fonction pour générer le code fixe (même logique que dans AccessCodeGenerator)
const generateFixedCode = (userId: string): string => {
  const baseCode = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
  const paddedCode = baseCode.padEnd(8, '0');
  
  return paddedCode
    .replace(/0/g, 'O')
    .replace(/1/g, 'I')
    .replace(/5/g, 'S')
    .substring(0, 8);
};

export const InstitutionAccessFormSimple = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { loading, result, validateAccess } = useInstitutionAccessSimple();
  const [testCode, setTestCode] = useState<string>("");
  
  // ID utilisateur de test pour AREZKI FARID (simulé)
  const testUserId = "5a476fae-7295-435a-80e2-25532e9dda8a";
  
  const [form, setForm] = useState<InstitutionAccessFormValues>({
    lastName: "AREZKI",
    firstName: "FARID", 
    birthDate: "1963-08-13",
    institutionCode: ""
  });

  // Générer le code de test au montage du composant
  useEffect(() => {
    const generatedCode = generateFixedCode(testUserId);
    setTestCode(generatedCode);
    setForm(prev => ({ ...prev, institutionCode: generatedCode }));
    console.log("Code de test généré:", generatedCode);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== SOUMISSION FORMULAIRE INSTITUTION ===");
    console.log("Données du formulaire:", form);
    
    const validationResult = await validateAccess(form);
    
    console.log("Résultat de validation:", validationResult);
    
    if (validationResult.success && validationResult.directiveData) {
      console.log("Formulaire: Succès, redirection vers mes-directives");
      
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
      {/* Informations sur l'accès institution */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès professionnel de santé</strong><br />
          Saisissez les informations du patient et le code d'accès institution pour consulter ses directives anticipées.
        </AlertDescription>
      </Alert>

      {/* Données de test avec le bon code */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Test disponible :</strong><br />
          AREZKI FARID, né le 13/08/1963<br />
          Code : <strong className="font-mono text-lg">{testCode}</strong>
          {testCode && (
            <div className="text-xs mt-1 text-green-600">
              Code généré automatiquement basé sur l'ID utilisateur
            </div>
          )}
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
          <p className="text-xs text-gray-500">
            Code permanent généré automatiquement pour le patient
          </p>
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
