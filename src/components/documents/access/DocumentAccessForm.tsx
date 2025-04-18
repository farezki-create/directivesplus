
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const accessFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessId: z.string().min(1, "Le code d'accès est requis")
});

type AccessFormData = z.infer<typeof accessFormSchema>;

interface DocumentAccessFormProps {
  onSubmit: (data: AccessFormData) => void;
  isVerifying: boolean;
}

export function DocumentAccessForm({ 
  onSubmit, 
  isVerifying 
}: DocumentAccessFormProps) {
  const form = useForm<AccessFormData>({
    resolver: zodResolver(accessFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessId: ""
    }
  });

  const handleSubmit = (data: AccessFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom du patient</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Prénom" 
                    {...field} 
                    disabled={isVerifying}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du patient</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nom" 
                    {...field}
                    disabled={isVerifying} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    disabled={isVerifying} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="accessId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code d'accès</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Code d'accès" 
                    {...field}
                    disabled={isVerifying} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder au document"
          )}
        </Button>
      </form>
    </Form>
  );
}
