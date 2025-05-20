
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { registerFormSchema, type RegisterFormValues } from "../schemas";
import { cleanupAuthState } from "@/utils/authUtils";

export const useRegisterForm = (onVerificationSent: (email: string) => void) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      email: "",
      address: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSignUp = async (values: RegisterFormValues) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign up...");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Try to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      // Format birthdate properly
      const birthDate = new Date(values.birthDate).toISOString().split('T')[0];
      
      // Now sign up
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: birthDate,
            address: values.address || null,
            phone_number: values.phoneNumber || null,
          },
          emailRedirectTo: window.location.origin + "/auth"
        }
      });

      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user?.identities && data.user.identities.length === 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un compte. Essayez de vous connecter.",
          variant: "destructive",
        });
      } else {
        console.log("Successful signup, session:", data.session ? "Available" : "Not available");
        console.log("Email confirmation required:", !data.session);
        
        toast({
          title: "Inscription réussie",
          description: data.session 
            ? "Votre compte a été créé avec succès. Vous êtes maintenant connecté."
            : "Veuillez vérifier votre email pour confirmer votre compte.",
        });
        
        onVerificationSent(values.email);
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSignUp
  };
};
