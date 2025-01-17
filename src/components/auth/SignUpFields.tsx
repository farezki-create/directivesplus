import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { PersonalInfoFields } from "./fields/PersonalInfoFields";
import { BirthDateField } from "./fields/BirthDateField";
import { AddressFields } from "./fields/AddressFields";
import { ContactFields } from "./fields/ContactFields";

type SignUpFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const SignUpFields = ({ form }: SignUpFieldsProps) => {
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

      <PersonalInfoFields form={form} />
      <BirthDateField form={form} />
      <AddressFields form={form} />
      <ContactFields form={form} />
    </div>
  );
};