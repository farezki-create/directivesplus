import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

type SignUpFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const SignUpFields = ({ form }: SignUpFieldsProps) => {
  const COUNTRY_PREFIXES = {
    "France": "+33",
    "Belgique": "+32",
    "Suisse": "+41",
    "Luxembourg": "+352",
    "Canada": "+1",
    "Monaco": "+377",
  } as const;

  type CountryKey = keyof typeof COUNTRY_PREFIXES;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Retapez votre mot de passe" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Votre prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de naissance</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Votre adresse" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input placeholder="Code postal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input placeholder="Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pays</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(COUNTRY_PREFIXES).map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone</FormLabel>
            <div className="flex gap-2">
              <Select 
                defaultValue={COUNTRY_PREFIXES[form.getValues("country") as CountryKey]} 
                disabled
              >
                <FormControl>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue>
                      {COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem 
                    value={COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                  >
                    {COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input 
                className="flex-1"
                placeholder="Votre numéro de téléphone" 
                {...field} 
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};