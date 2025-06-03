
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="votre@email.com" 
                {...field}
                value={field.value || ""}
              />
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
              <Input 
                placeholder="Votre adresse complète" 
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone (optionnel)</FormLabel>
            <FormControl>
              <Input 
                type="tel" 
                placeholder="+33 1 23 45 67 89" 
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
