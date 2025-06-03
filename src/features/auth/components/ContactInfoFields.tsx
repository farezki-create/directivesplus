
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../schemas";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Phone } from "lucide-react";

interface ContactInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

const countryCodes = [
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+32", country: "Belgique", flag: "🇧🇪" },
  { code: "+41", country: "Suisse", flag: "🇨🇭" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "Royaume-Uni", flag: "🇬🇧" },
  { code: "+49", country: "Allemagne", flag: "🇩🇪" },
];

export const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="pl-10"
                  {...field} 
                />
              </div>
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
            <FormLabel>Téléphone * (France uniquement)</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 min-w-[80px]">
                  <span>🇫🇷</span>
                  <span className="text-sm font-mono">+33</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="123456789"
                    className="pl-10"
                    value={field.value}
                    onChange={(e) => {
                      // Permet seulement les chiffres
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
                </div>
              </div>
            </FormControl>
            <p className="text-xs text-gray-500">
              Format: +33123456789 (sans le premier 0)
            </p>
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
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Votre adresse complète" 
                  className="pl-10"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
