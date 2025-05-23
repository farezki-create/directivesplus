
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export interface AccessFormValues {
  firstName: string;
  lastName: string;
  birthdate: string;
  accessCode: string;
}

interface AccessFormProps {
  onSubmit: (values: AccessFormValues) => void;
  loading: boolean;
  error?: string | null;
  initialCode?: string | null;
  verificationAttempted?: boolean;
}

export const AccessForm = ({ onSubmit, loading, error, initialCode, verificationAttempted = false }: AccessFormProps) => {
  const [searchParams] = useSearchParams();
  const codeParam = initialCode || searchParams.get("code");
  
  const [form, setForm] = useState<AccessFormValues>({
    firstName: "",
    lastName: "",
    birthdate: "",
    accessCode: codeParam || ""
  });

  // Update the form if the code parameter changes
  useEffect(() => {
    if (codeParam) {
      setForm(prev => ({ ...prev, accessCode: codeParam }));
    }
  }, [codeParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with values:", form);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Show a special message if verification was attempted with a code from URL and failed */}
      {verificationAttempted && codeParam && error && (
        <Alert variant="warning" className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Le code d'accès fourni dans l'URL semble être invalide ou expiré. 
            Veuillez vérifier vos informations et réessayer.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          name="lastName"
          placeholder="Nom de famille"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthdate">Date de naissance</Label>
        <Input
          id="birthdate"
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accessCode">Code d'accès</Label>
        <Input
          id="accessCode"
          name="accessCode"
          placeholder="Code d'accès"
          value={form.accessCode}
          onChange={handleChange}
          required
          className={codeParam ? "bg-gray-100" : ""}
          readOnly={!!codeParam}
        />
        {codeParam && (
          <p className="text-xs text-muted-foreground">
            Code d'accès chargé automatiquement depuis l'URL
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Vérification..." : "Accéder à mon dossier"}
      </Button>
    </form>
  );
};
