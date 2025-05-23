
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstitutionAccessFormValues } from "@/hooks/access/useInstitutionAccess";

interface FormFieldsProps {
  form: InstitutionAccessFormValues;
  validationErrors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormFields = ({ form, validationErrors, onChange }: FormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom du patient *</Label>
        <Input
          id="lastName"
          name="lastName"
          placeholder="Nom de famille du patient"
          value={form.lastName}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
    </>
  );
};
