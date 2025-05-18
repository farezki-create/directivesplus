
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInformationFields from "./PersonalInformationFields";
import AddressInformationFields from "./AddressInformationFields";

// Profile schema with validation
const profileSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide").optional(),
  birthDate: z.date().optional(),
  phoneNumber: z.string()
    .regex(/^[0-9+\s-]{6,15}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string()
    .regex(/^[0-9]{5}$/, "Code postal invalide (5 chiffres)")
    .optional()
    .or(z.literal('')),
  country: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialValues: ProfileFormValues;
  profileId: string;
  onProfileUpdate: (updatedProfile: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ProfileForm({ 
  initialValues, 
  profileId, 
  onProfileUpdate,
  isLoading,
  setIsLoading
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsLoading(true);
      
      // Format the birthDate for the database if it exists
      const formattedBirthDate = values.birthDate ? values.birthDate.toISOString().split('T')[0] : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          birth_date: formattedBirthDate,
          phone_number: values.phoneNumber,
          address: values.address,
          city: values.city,
          postal_code: values.postalCode,
          country: values.country,
        })
        .eq("id", profileId);

      if (error) {
        toast.error("Erreur lors de la mise à jour du profil", {
          description: error.message,
        });
        return;
      }

      toast.success("Profil mis à jour avec succès");
      
      // Update parent component's state
      onProfileUpdate({
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: formattedBirthDate,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
        country: values.country,
      });
    } catch (error: any) {
      toast.error("Une erreur est survenue", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInformationFields />
        <AddressInformationFields />
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
            disabled={isLoading}
          >
            Mettre à jour le profil
          </Button>
        </div>
      </form>
    </Form>
  );
}
