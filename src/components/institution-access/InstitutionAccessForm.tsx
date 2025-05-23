
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateInstitutionAccessForm(form);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    await verifyInstitutionAccess(form);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Cet accès est réservé aux professionnels de santé et institutions médicales autorisés.
          </AlertDescription>
        </Alert>
      </div>

      {error && error.includes("Aucun code d'accès institution n'existe") && (
        <div className="mb-6">
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
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && !error.includes("Aucun code d'accès institution n'existe") && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
          {loading ? "Vérification..." : "Accéder aux directives"}
        </Button>
      </form>
      
      <DirectivesDisplay documents={documents} />
    </div>
  );
};
