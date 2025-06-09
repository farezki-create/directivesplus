
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PersonalInformationFields from "./PersonalInformationFields";
import AddressInformationFields from "./AddressInformationFields";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function ProfileForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitProgress, setSubmitProgress] = useState(0);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
    }
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      setFormState('submitting');
      
      // Start progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSubmitProgress(progress > 90 ? 90 : progress);
      }, 100);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear interval and complete progress
      clearInterval(interval);
      setSubmitProgress(100);
      
      setFormState('success');
      toast({
        title: "Profil mis à jour avec succès",
        description: "Vos informations ont été sauvegardées."
      });
      
      // Reset form state after success
      setTimeout(() => {
        setFormState('idle');
      }, 2000);
    } catch (error: any) {
      setFormState('error');
      toast({
        title: "Une erreur est survenue",
        description: error.message || "Veuillez réessayer plus tard",
        variant: "destructive"
      });
    }
  }
  
  // Button icon based on form state
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInformationFields />
        <AddressInformationFields />
        
        {formState === 'submitting' && (
          <div className="my-4">
            <Progress value={submitProgress} className="h-2" />
            <p className="text-sm text-center mt-1 text-muted-foreground">Mise à jour du profil...</p>
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
            disabled={formState === 'submitting'}
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
