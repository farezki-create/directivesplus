
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormValues {
  firstName: string;
  lastName: string;
  birthDate: Date;
  accessCode: string;
}

interface PersonalInfoFieldsProps {
  control: Control<FormValues>;
  loading: boolean;
}

const PersonalInfoFields = ({ control, loading }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom du patient</FormLabel>
            <FormControl>
              <Input placeholder="Prénom" {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du patient</FormLabel>
            <FormControl>
              <Input placeholder="Nom" {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="accessCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Code d'accès</FormLabel>
            <FormControl>
              <Input placeholder="Code d'accès" {...field} disabled={loading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoFields;
