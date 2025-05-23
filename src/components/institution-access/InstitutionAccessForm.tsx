
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { InstitutionAccessFormValues, useInstitutionAccess } from "@/hooks/access/useInstitutionAccess";

export const InstitutionAccessForm = () => {
  const { loading, error, documents, verifyInstitutionAccess } = useInstitutionAccess();
  const [form, setForm] = useState<InstitutionAccessFormValues>({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: ""
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!form.lastName.trim()) {
      errors.lastName = "Le nom du patient est requis";
    }
    
    if (!form.firstName.trim()) {
      errors.firstName = "Le prénom du patient est requis";
    }
    
    if (!form.birthDate) {
      errors.birthDate = "La date de naissance est requise";
    } else {
      // Valider le format de la date
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(form.birthDate)) {
        errors.birthDate = "Format de date invalide";
      } else {
        // Vérifier que la date n'est pas dans le futur
        const birthDate = new Date(form.birthDate);
        const today = new Date();
        if (birthDate > today) {
          errors.birthDate = "La date de naissance ne peut pas être dans le futur";
        }
      }
    }
    
    if (!form.institutionCode.trim()) {
      errors.institutionCode = "Le code d'accès institution est requis";
    } else if (form.institutionCode.trim().length < 6) {
      errors.institutionCode = "Le code d'accès doit contenir au moins 6 caractères";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    
    if (!validateForm()) {
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom du patient *</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Nom de famille du patient"
            value={form.lastName}
            onChange={handleChange}
            className={validationErrors.lastName ? "border-red-500" : ""}
            required
          />
          {validationErrors.lastName && (
            <p className="text-sm text-red-500">{validationErrors.lastName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom du patient *</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Prénom du patient"
            value={form.firstName}
            onChange={handleChange}
            className={validationErrors.firstName ? "border-red-500" : ""}
            required
          />
          {validationErrors.firstName && (
            <p className="text-sm text-red-500">{validationErrors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance *</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            className={validationErrors.birthDate ? "border-red-500" : ""}
            required
          />
          {validationErrors.birthDate && (
            <p className="text-sm text-red-500">{validationErrors.birthDate}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institutionCode">Code d'accès institution *</Label>
          <Input
            id="institutionCode"
            name="institutionCode"
            placeholder="Code d'accès institution"
            value={form.institutionCode}
            onChange={handleChange}
            className={validationErrors.institutionCode ? "border-red-500" : ""}
            required
          />
          {validationErrors.institutionCode && (
            <p className="text-sm text-red-500">{validationErrors.institutionCode}</p>
          )}
          <p className="text-xs text-gray-500">
            Saisissez le code fourni par le patient ou obtenu via l'interface de génération
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
      
      {documents.length > 0 && (
        <div className="mt-8 space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              {documents.length} directive(s) trouvée(s) pour ce patient
            </AlertDescription>
          </Alert>
          
          <h3 className="text-lg font-medium">Directives trouvées</h3>
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Directive anticipée</h4>
                <span className="text-sm text-gray-500">
                  {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="bg-white p-3 rounded border max-h-60 overflow-y-auto">
                {doc.content && typeof doc.content === 'object' ? (
                  <div className="space-y-2">
                    {Object.entries(doc.content).map(([key, value]) => (
                      <div key={key}>
                        <strong className="capitalize">{key.replace('_', ' ')}:</strong>
                        <p className="text-sm ml-2">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">{String(doc.content)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
