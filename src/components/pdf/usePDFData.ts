import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, TrustedPerson } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function usePDFData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer la session et les métadonnées de l'utilisateur
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("[PDFData] No user session");
          setLoading(false);
          
          const errorMessage = currentLanguage === 'en' 
            ? "You need to be logged in to generate a PDF."
            : "Vous devez être connecté pour générer un PDF.";
            
          setError(errorMessage);
          toast({
            title: currentLanguage === 'en' ? "Authentication required" : "Authentification requise",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }

        const { data: user } = await supabase.auth.getUser();
        const userData = user?.user?.user_metadata;
        console.log("[PDFData] User metadata:", userData);

        // Charger le profil existant ou en créer un nouveau
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[PDFData] Error loading profile:", profileError);
          toast({
            title: "Information manquante",
            description: "Veuillez d'abord compléter votre profil dans les paramètres avant de générer vos directives.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Si le profil n'existe pas, on le crée avec les métadonnées de l'utilisateur
        if (!profileData) {
          console.log("[PDFData] Creating new profile with user metadata:", userData);
          const newProfile = {
            id: session.user.id,
            first_name: userData?.first_name || null,
            last_name: userData?.last_name || null
          };

          const { data: insertedProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([newProfile])
            .select()
            .single();

          if (insertError) {
            console.error("[PDFData] Error creating profile:", insertError);
            throw insertError;
          }

          setProfile({
            ...insertedProfile,
            email: session.user.email,
            unique_identifier: session.user.id
          });
        } else {
          // Utiliser les données du profil existant ou les métadonnées de l'utilisateur
          const updatedProfile = {
            ...profileData,
            first_name: profileData.first_name || userData?.first_name || null,
            last_name: profileData.last_name || userData?.last_name || null,
            email: session.user.email,
            unique_identifier: session.user.id
          };

          console.log("[PDFData] Using profile data:", updatedProfile);
          setProfile(updatedProfile);
        }
        
        // Charger les personnes de confiance
        const { data: trustedPersonsData, error: trustedPersonsError } = await supabase
          .from("trusted_persons")
          .select("*")
          .eq("user_id", session.user.id);

        if (trustedPersonsError) {
          console.error("[PDFData] Error loading trusted persons:", trustedPersonsError);
          toast({
            title: "Attention",
            description: "Impossible de charger vos personnes de confiance.",
            variant: "destructive",
          });
        } else {
          setTrustedPersons(trustedPersonsData || []);
        }

      } catch (error) {
        console.error("[PDFData] Error loading user data:", error);
        const errorMessage = currentLanguage === 'en' 
          ? "An error occurred while loading your data."
          : "Une erreur est survenue lors du chargement de vos données.";
        
        setError(errorMessage);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [toast, currentLanguage]);

  return { profile, trustedPersons, loading, error };
}
