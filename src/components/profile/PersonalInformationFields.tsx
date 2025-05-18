
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface PersonalInformationFieldsProps {
  isEmailDisabled?: boolean;
}

export default function PersonalInformationFields({ isEmailDisabled = true }: PersonalInformationFieldsProps) {
  const form = useFormContext();
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Prénom" 
                  {...field} 
                  className={cn(
                    form.formState.errors.firstName && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage className="animate-fade-in" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom" 
                  {...field} 
                  className={cn(
                    form.formState.errors.lastName && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage className="animate-fade-in" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" disabled={isEmailDisabled} {...field} />
            </FormControl>
            <FormDescription>
              L'adresse email ne peut pas être modifiée
            </FormDescription>
            <FormMessage className="animate-fade-in" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => {
          // Convertir la date en format YYYY-MM-DD pour l'input de type date
          const value = field.value 
            ? (field.value instanceof Date 
                ? field.value.toISOString().split('T')[0]
                : field.value) 
            : '';
            
          return (
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="JJ/MM/AAAA"
                  value={value}
                  onChange={(e) => {
                    // Convertir la chaîne de date en objet Date
                    const date = e.target.value ? new Date(e.target.value) : null;
                    field.onChange(date);
                  }}
                  className={cn(
                    form.formState.errors.birthDate && "border-red-500 focus-visible:ring-red-500"
                  )}
                  max={new Date().toISOString().split('T')[0]} // Ne pas permettre des dates futures
                  min="1900-01-01" // Date minimale à 1900
                />
              </FormControl>
              <FormMessage className="animate-fade-in" />
            </FormItem>
          );
        }}
      />
      
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Téléphone" 
                {...field} 
                className={cn(
                  form.formState.errors.phoneNumber && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </FormControl>
            <FormMessage className="animate-fade-in" />
          </FormItem>
        )}
      />
    </>
  );
}
