import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface MedicalInfoProps {
  form: UseFormReturn<any>;
}

export const MedicalInfo = ({ form }: MedicalInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="medicalInfo.currentHealth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>État de santé actuel</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicalInfo.medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Médicaments actuels</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                onChange={(e) => field.onChange(e.target.value.split('\n'))}
                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                placeholder="Entrez un médicament par ligne"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicalInfo.allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allergies</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                onChange={(e) => field.onChange(e.target.value.split('\n'))}
                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                placeholder="Entrez une allergie par ligne"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};