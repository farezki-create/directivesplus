
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddressInformationFields() {
  const form = useFormContext();
  
  // Check if any address field has a value but not all are filled
  const hasPartialAddress = () => {
    const { address, city, postalCode, country } = form.getValues();
    const hasAny = Boolean(address || city || postalCode || country);
    const hasAll = Boolean(address && city && postalCode && country);
    return hasAny && !hasAll;
  };
  
  return (
    <>
      {hasPartialAddress() && (
        <Alert className="bg-amber-50 border-amber-200 mb-4">
          <AlertDescription className="text-amber-800">
            Pour une meilleure prise en charge, nous vous recommandons de compléter l'ensemble de vos informations d'adresse.
          </AlertDescription>
        </Alert>
      )}
    
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input 
                placeholder="Adresse" 
                {...field}
                className={cn(
                  form.formState.errors.address && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </FormControl>
            <FormMessage className="animate-fade-in" />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Code postal" 
                  {...field}
                  className={cn(
                    form.formState.errors.postalCode && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage className="animate-fade-in" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ville" 
                  {...field}
                  className={cn(
                    form.formState.errors.city && "border-red-500 focus-visible:ring-red-500"
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
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pays</FormLabel>
            <FormControl>
              <Input 
                placeholder="Pays" 
                {...field}
                className={cn(
                  form.formState.errors.country && "border-red-500 focus-visible:ring-red-500"
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
