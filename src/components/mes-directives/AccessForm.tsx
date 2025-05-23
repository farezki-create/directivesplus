
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface AccessFormValues {
  firstName: string;
  lastName: string;
  birthdate: string;
  accessCode: string;
}

interface AccessFormProps {
  onSubmit: (values: AccessFormValues) => void;
  loading: boolean;
}

export const AccessForm = ({ onSubmit, loading }: AccessFormProps) => {
  const [form, setForm] = useState<AccessFormValues>({
    firstName: "",
    lastName: "",
    birthdate: "",
    accessCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
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
