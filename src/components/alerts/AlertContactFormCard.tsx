
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertContact } from "@/hooks/alerts/types";

interface AlertContactFormProps {
  contact: AlertContact;
  index: number;
  onChange: (index: number, field: keyof AlertContact, value: string) => void;
}

const CONTACT_TYPES = [
  { value: 'famille', label: 'Membre de la famille' },
  { value: 'personne_confiance', label: 'Personne de confiance' },
  { value: 'autre', label: 'Autre' }
];

export const AlertContactForm = ({ contact, index, onChange }: AlertContactFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`contact_type-${index}`}>Type de contact *</Label>
          <Select
            value={contact.contact_type}
            onValueChange={(value) => onChange(index, 'contact_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`contact_name-${index}`}>Nom du contact *</Label>
          <Input
            id={`contact_name-${index}`}
            value={contact.contact_name}
            onChange={(e) => onChange(index, 'contact_name', e.target.value)}
            placeholder="Dr. Martin, Marie Dupont..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`phone_number-${index}`}>Téléphone</Label>
          <Input
            id={`phone_number-${index}`}
            value={contact.phone_number || ''}
            onChange={(e) => onChange(index, 'phone_number', e.target.value)}
            placeholder="+33 6 12 34 56 78"
            type="tel"
          />
        </div>
        <div>
          <Label htmlFor={`email-${index}`}>Email</Label>
          <Input
            id={`email-${index}`}
            value={contact.email || ''}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            placeholder="contact@exemple.fr"
            type="email"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        * Au moins un numéro de téléphone ou un email est requis
      </div>
    </div>
  );
};
