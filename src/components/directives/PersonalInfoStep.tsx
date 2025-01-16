import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoStepProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

export function PersonalInfoStep({ 
  selectedCountry, 
  onCountryChange 
}: PersonalInfoStepProps) {
  const COUNTRY_PREFIXES = {
    "France": "+33",
    "Belgique": "+32",
    "Suisse": "+41",
    "Luxembourg": "+352",
    "Canada": "+1",
    "Monaco": "+377",
  } as const;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informations personnelles</h2>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Genre</Label>
        <Select>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Sélectionnez votre genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Homme</SelectItem>
            <SelectItem value="female">Femme</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input id="firstName" placeholder="Votre prénom" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input id="lastName" placeholder="Votre nom" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthdate">Date de naissance</Label>
        <Input id="birthdate" type="date" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adresse</h3>
        
        <div className="space-y-2">
          <Label htmlFor="street">Rue</Label>
          <Textarea 
            id="street" 
            placeholder="Numéro et nom de rue"
            className="min-h-[60px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input 
              id="postalCode" 
              placeholder="Code postal"
              pattern="[0-9]{5}"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" placeholder="Ville" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Select 
            value={selectedCountry}
            onValueChange={onCountryChange}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(COUNTRY_PREFIXES).map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="flex gap-2">
          <Select defaultValue={COUNTRY_PREFIXES[selectedCountry as keyof typeof COUNTRY_PREFIXES]} disabled>
            <SelectTrigger className="w-[100px]">
              <SelectValue>{COUNTRY_PREFIXES[selectedCountry as keyof typeof COUNTRY_PREFIXES]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COUNTRY_PREFIXES[selectedCountry as keyof typeof COUNTRY_PREFIXES]}>
                {COUNTRY_PREFIXES[selectedCountry as keyof typeof COUNTRY_PREFIXES]}
              </SelectItem>
            </SelectContent>
          </Select>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="Votre numéro de téléphone"
            pattern="[0-9]{9}"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}