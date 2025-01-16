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
            <FormLabel className="text-base font-medium">Email</FormLabel>
            <FormControl>
              <Input 
                placeholder="Votre adresse email" 
                type="email"
                autoComplete="email"
                className="h-12"
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
            <FormLabel className="text-base font-medium">
              Mot de passe
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder={isSignUp ? "Choisissez un mot de passe fort" : "Votre mot de passe"} 
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="h-12"
                {...field} 
              />
            </FormControl>
            <FormMessage />
            {isSignUp && (
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Au moins 8 caractères</li>
                <li>• Au moins une lettre majuscule</li>
                <li>• Au moins une lettre minuscule</li>
                <li>• Au moins un chiffre</li>
                <li>• Au moins un caractère spécial (!@#$%^&*)</li>
              </ul>
            )}
          </FormItem>
        )}
      />
    </>
  );
};