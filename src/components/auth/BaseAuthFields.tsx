
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { useLanguage } from "@/hooks/language/useLanguage";

type BaseAuthFieldsProps = {
  form: UseFormReturn<FormValues>;
  isSignUp: boolean;
};

export const BaseAuthFields = ({ form, isSignUp }: BaseAuthFieldsProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('email')}</FormLabel>
            <FormControl>
              <Input placeholder="Votre adresse email" {...field} />
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
              {t('password')}
              {isSignUp && t('passwordHint')}
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder={isSignUp ? t('choosePassword') : t('yourPassword')} 
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
