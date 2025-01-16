import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

type PasswordConfirmFieldProps = {
  form: UseFormReturn<FormValues>;
};

export const PasswordConfirmField = ({ form }: PasswordConfirmFieldProps) => {
  return (
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
              autoComplete="new-password"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};