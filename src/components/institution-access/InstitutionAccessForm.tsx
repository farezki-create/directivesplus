
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useAccessCode } from "@/hooks/useAccessCode";
import { AccessCodeService } from "@/services/accessCode/AccessCodeService";
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
  const { validateCode, isValidating } = useAccessCode();
  const [result, setResult] = useState<any>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  
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
    
    console.log("=== SOUMISSION FORMULAIRE INSTITUTION (DÉBOGAGE COMPLET) ===");
    console.log("Données du formulaire:", {
      lastName: form.lastName,
      firstName: form.firstName,
      birthDate: form.birthDate,
      institutionCode: form.institutionCode
    });
    
    // Validation des champs
    if (!form.lastName.trim() || !form.firstName.trim() || !form.birthDate || !form.institutionCode.trim()) {
      console.error("❌ Champs manquants");
      setResult({
        success: false,
        error: "Tous les champs sont obligatoires"
      });
      return;
    }

    console.log("🔍 Début validation avec AccessCodeService...");
    
    const validationResult = await validateCode(form.institutionCode.trim(), {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate
    });
    
    console.log("📊 Résultat de validation complet:", validationResult);
    setResult(validationResult);
    
    if (validationResult.success && validationResult.documents) {
      console.log("✅ Validation réussie - Documents trouvés:", validationResult.documents.length);
      
      // Créer un dossier pour le store avec la nouvelle structure
      const dossier = {
        id: `institution-${validationResult.userId || 'unknown'}`,
        userId: validationResult.userId || '',
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
          documents: validationResult.documents,
          accessType: validationResult.accessType || 'institution'
        }
      };
      
      console.log("📁 Dossier créé pour navigation:", dossier);
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: `${validationResult.documents.length} document(s) accessible(s)`
      });
      
      navigate("/mes-directives");
    } else {
      console.error("❌ Échec de validation:", validationResult.error);
      toast({
        title: "Accès refusé",
        description: validationResult.error || "Code d'accès invalide",
        variant: "destructive"
      });
    }
  };

  const handleDiagnostic = async () => {
    if (!form.firstName || !form.lastName) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez saisir au moins le nom et prénom",
        variant: "destructive"
      });
      return;
    }

    console.log("🔍 Lancement diagnostic...");
    const diagnostic = await AccessCodeService.diagnosticSystem({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate
    });
    
    setDiagnosticInfo(diagnostic);
    console.log("📋 Diagnostic terminé:", diagnostic);
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

      {/* Bouton de diagnostic */}
      <div className="space-y-2">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleDiagnostic}
        >
          🔍 Diagnostic du système
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Cliquez pour diagnostiquer les problèmes d'accès
        </p>
      </div>

      {/* Informations de diagnostic */}
      {diagnosticInfo && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Info className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Diagnostic :</strong> {diagnosticInfo.diagnostic}
            <br />
            <small>{diagnosticInfo.recommendation}</small>
            {diagnosticInfo.testUserCreated && (
              <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
                <strong>Données de test créées :</strong><br />
                Code: <code className="bg-yellow-200 px-1 rounded">{diagnosticInfo.testUserCreated.fixedCode}</code><br />
                Nom: AREZKI, Prénom: FARID<br />
                Date: 1963-08-13
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

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
                <br />
                Type d'accès : {result.accessType}
                <br />
                Utilisateur : {result.userId}
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

      {/* Debug info en développement */}
      {process.env.NODE_ENV === 'development' && (
        <Alert className="bg-gray-50 border-gray-200">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Debug:</strong> Vérifiez la console pour les détails de validation
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
