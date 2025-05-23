
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { InstitutionAccessFormValues, useInstitutionAccess } from "@/hooks/access/useInstitutionAccess";
import { validateInstitutionAccessForm } from "@/hooks/access/institution/useInstitutionAccessValidation";
import { FormFields } from "./FormFields";
import { DirectivesDisplay } from "./DirectivesDisplay";

export const InstitutionAccessForm = () => {
  const { loading, error, documents, verifyInstitutionAccess } = useInstitutionAccess();
  const [form, setForm] = useState<InstitutionAccessFormValues>({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: ""
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttempted(true);
    
    const errors = validateInstitutionAccessForm(form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const success = await verifyInstitutionAccess(form);
    if (success) {
      console.log("Institution access verification successful");
    }
  };

  const renderErrorAlert = () => {
    if (!error) return null;

    if (error.includes("Aucun code d'accès institution n'existe")) {
      return (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Information importante :</strong><br />
            Il n'y a actuellement aucun code d'accès institution dans la base de données. 
            <br /><br />
            Pour tester cette fonctionnalité, vous devez :
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Vous connecter à votre compte</li>
              <li>Créer ou accéder à vos directives</li>
              <li>Utiliser le bouton "Accès institution" pour générer un code</li>
              <li>Revenir ici avec ce code généré</li>
            </ol>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Cet accès est réservé aux professionnels de santé et institutions médicales autorisés.
            Les accès sont journalisés pour des raisons de sécurité.
          </AlertDescription>
        </Alert>
      </div>

      {documents.length > 0 && (
        <div className="mb-6">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Accès autorisé :</strong> {documents.length} directive(s) trouvée(s) pour ce patient.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderErrorAlert()}
        
        <FormFields 
          form={form} 
          validationErrors={validationErrors} 
          onChange={handleChange} 
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Vérification en cours..." : "Accéder aux directives"}
        </Button>

        {hasAttempted && !loading && !error && documents.length === 0 && (
          <Alert className="bg-gray-50 border-gray-200">
            <Info className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700">
              Vérification terminée. Aucun résultat trouvé.
            </AlertDescription>
          </Alert>
        )}
      </form>
      
      <DirectivesDisplay documents={documents} />
    </div>
  );
};
