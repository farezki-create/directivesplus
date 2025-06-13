
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PersonalInformationFields from "./PersonalInformationFields";
import AddressInformationFields from "./AddressInformationFields";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileSubmit } from "./useProfileSubmit";

// Schema de validation du profil
const profileSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide").optional(),
  birthDate: z.date({ required_error: "Date de naissance requise" }),
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

  const { submitProfile, formState, submitProgress } = useProfileSubmit({
    profileId,
    onProfileUpdate,
    setIsLoading
  });

  // Icône du bouton selon l'état
  const ButtonIcon = () => {
    switch(formState) {
      case 'submitting':
        return <LoaderCircle className="animate-spin" />;
      case 'success':
        return <Check className="text-green-500" />;
      case 'error':
        return <X className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitProfile)} className="space-y-4">
        <PersonalInformationFields />
        <AddressInformationFields />
        
        {formState === 'submitting' && (
          <div className="my-4">
            <Progress value={submitProgress} className="h-2" />
            <p className="text-sm text-center mt-1 text-muted-foreground">
              Mise à jour du profil...
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <Button
            type="submit"
            className={cn(
              "w-full transition-all duration-300",
              formState === 'success' && "bg-green-600 hover:bg-green-700",
              formState === 'error' && "bg-red-600 hover:bg-red-700",
              formState === 'idle' && "bg-directiveplus-600 hover:bg-directiveplus-700"
            )}
            disabled={isLoading || formState === 'submitting'}
          >
            <span className="flex items-center gap-2">
              <ButtonIcon />
              {formState === 'submitting' ? 'Mise à jour en cours...' : 
               formState === 'success' ? 'Mis à jour avec succès' : 
               formState === 'error' ? 'Erreur, réessayer' : 
               'Mettre à jour le profil'}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
