import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

type BaseAuthFieldsProps = {
  form: UseFormReturn<FormValues>;
  isSignUp: boolean;
};

export const BaseAuthFields = ({ form, isSignUp }: BaseAuthFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                placeholder="Votre adresse email" 
                type="email"
                autoComplete="email"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Mot de passe
              {isSignUp && " (8 caractères min., 1 majuscule, 1 chiffre)"}
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder={isSignUp ? "Choisissez un mot de passe fort" : "Votre mot de passe"} 
                autoComplete={isSignUp ? "new-password" : "current-password"}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};