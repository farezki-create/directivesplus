
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define zod schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type FormData = z.infer<typeof formSchema>;

export const useAccessDocumentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Initialize react-hook-form with zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const accessDirectives = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    
    const formData = form.getValues();
    
    setLoading(true);
    try {
      // Vérifier si le code d'accès existe dans document_access_codes
      const { data: accessData, error: accessError } = await supabase
        .from('document_access_codes')
        .select('user_id')
        .eq('access_code', formData.accessCode.trim());
      
      if (accessError) throw accessError;
      
      if (!accessData || accessData.length === 0) {
        toast({
          title: "Accès refusé",
          description: "Code d'accès invalide",
          variant: "destructive"
        });
        return;
      }
      
      const userId = accessData[0].user_id;
      
      // Vérifier si les informations du profil correspondent
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      if (!profileData || profileData.length === 0) {
        toast({
          title: "Erreur",
          description: "Profil utilisateur introuvable",
          variant: "destructive"
        });
        return;
      }
      
      const profile = profileData[0];
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Access granted - would normally fetch and display directives
      toast({
        title: "Accès autorisé",
        description: "Chargement des directives anticipées...",
      });
      
      // Here we would fetch and display the directives
      // For now, just mock the success
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de l'accès",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const accessMedicalData = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    
    const formData = form.getValues();
    
    setLoading(true);
    try {
      // Vérifier si le code d'accès existe dans profiles (medical_access_code)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('medical_access_code', formData.accessCode.trim());
      
      if (profilesError) throw profilesError;
      
      if (!profilesData || profilesData.length === 0) {
        toast({
          title: "Accès refusé",
          description: "Code d'accès médical invalide",
          variant: "destructive"
        });
        return;
      }
      
      const profile = profilesData[0];
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Access granted - would normally fetch and display medical data
      toast({
        title: "Accès autorisé",
        description: "Chargement des données médicales...",
      });
      
      // Here we would fetch and display the medical data
      // For now, just mock the success
      setTimeout(() => {
        navigate('/donnees-medicales');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux données médicales:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de l'accès",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    accessDirectives,
    accessMedicalData
  };
};
