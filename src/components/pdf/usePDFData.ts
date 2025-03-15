
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

        // Récupérer les métadonnées de l'utilisateur depuis l'authentification
        const { data: userData } = await supabase.auth.getUser();
        const userMetadata = userData?.user?.user_metadata;
        console.log("[PDFData] User metadata from auth:", userMetadata);

        // Charger le profil existant
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

        // Si le profil n'existe pas, le créer avec les métadonnées de l'utilisateur
        if (!profileData) {
          console.log("[PDFData] Creating new profile with user metadata:", userMetadata);
          const newProfile = {
            id: session.user.id,
            first_name: userMetadata?.first_name || null,
            last_name: userMetadata?.last_name || null,
            birth_date: userMetadata?.birth_date || null,
            address: userMetadata?.address || null,
            city: userMetadata?.city || null,
            postal_code: userMetadata?.postal_code || null,
            country: userMetadata?.country || null,
            phone_number: userMetadata?.phone_number || null
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
          // Fusionner les données du profil existant avec les métadonnées de l'utilisateur
          // Prioriser les données du profil si elles existent, sinon utiliser les métadonnées
          const mergedProfile = {
            ...profileData,
            first_name: profileData.first_name || userMetadata?.first_name || null,
            last_name: profileData.last_name || userMetadata?.last_name || null,
            birth_date: profileData.birth_date || userMetadata?.birth_date || null,
            address: profileData.address || userMetadata?.address || null,
            city: profileData.city || userMetadata?.city || null,
            postal_code: profileData.postal_code || userMetadata?.postal_code || null,
            country: profileData.country || userMetadata?.country || null,
            phone_number: profileData.phone_number || userMetadata?.phone_number || null,
            email: session.user.email,
            unique_identifier: session.user.id
          };

          console.log("[PDFData] Merged profile data:", mergedProfile);
          
          // Mettre à jour le profil avec les données fusionnées si nécessaire
          if (JSON.stringify(profileData) !== JSON.stringify({
            ...mergedProfile,
            email: undefined,
            unique_identifier: undefined
          })) {
            console.log("[PDFData] Updating profile with merged data");
            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                first_name: mergedProfile.first_name,
                last_name: mergedProfile.last_name,
                birth_date: mergedProfile.birth_date,
                address: mergedProfile.address,
                city: mergedProfile.city,
                postal_code: mergedProfile.postal_code,
                country: mergedProfile.country,
                phone_number: mergedProfile.phone_number
              })
              .eq("id", session.user.id);

            if (updateError) {
              console.error("[PDFData] Error updating profile:", updateError);
            }
          }

          setProfile(mergedProfile);
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
