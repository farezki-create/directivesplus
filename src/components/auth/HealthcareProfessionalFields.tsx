import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "./types";

type HealthcareProfessionalFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const HealthcareProfessionalFields = ({
  form,
}: HealthcareProfessionalFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="rppsNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro RPPS</FormLabel>
            <FormControl>
              <Input placeholder="Entrez votre numéro RPPS" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="professionalType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de professionnel</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre profession" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="doctor">Médecin</SelectItem>
                <SelectItem value="nurse">Infirmier(e)</SelectItem>
                <SelectItem value="pharmacist">Pharmacien(ne)</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spécialité (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Entrez votre spécialité" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};