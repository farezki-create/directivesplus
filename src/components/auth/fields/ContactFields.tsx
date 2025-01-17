import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { COUNTRY_PREFIXES } from "../constants";

type ContactFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const ContactFields = ({ form }: ContactFieldsProps) => {
  return (
    <>
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
                defaultValue={COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]} 
                disabled
              >
                <FormControl>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue>
                      {COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem 
                    value={COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
                  >
                    {COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
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
    </>
  );
};