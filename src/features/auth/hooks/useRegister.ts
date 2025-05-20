
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { RegisterFormValues } from "../schemas";
import { cleanupAuthState } from "@/utils/authUtils";
import { generateRandomCode } from "@/hooks/useAccessCode";

export const useRegister = (onVerificationSent: (email: string) => void) => {
  const [loading, setLoading] = useState(false);
  
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
      
      // Generate access codes in advance
      const medicalAccessCode = generateRandomCode(8);
      
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
            medical_access_code: medicalAccessCode
          },
          emailRedirectTo: window.location.origin + "/auth"
        }
      });

      if (error) throw error;
      
      // If user is created successfully, create directive access code entry
      if (data?.user) {
        const directiveAccessCode = generateRandomCode(8);
        
        // Create directive access code in document_access_codes table
        const { error: directiveError } = await supabase
          .from('document_access_codes')
          .insert({
            user_id: data.user.id,
            access_code: directiveAccessCode,
            is_full_access: true
          });
          
        if (directiveError) {
          console.error("Error creating directive access code:", directiveError);
        }
      }
      
      // Check if email confirmation is required
      if (data?.user?.identities && data.user.identities.length === 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un compte. Essayez de vous connecter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
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

  return { handleSignUp, loading };
};
