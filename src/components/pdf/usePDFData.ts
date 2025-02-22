
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, TrustedPerson } from "./types";
import { useToast } from "@/hooks/use-toast";

export function usePDFData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("[PDFData] No user session");
          setLoading(false);
          return;
        }

        console.log("[PDFData] Loading user profile for:", session.user.id);
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

        if (!profileData) {
          console.log("[PDFData] No profile found, creating one");
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: session.user.id }])
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("[PDFData] Error creating profile:", insertError);
            throw insertError;
          }

          setProfile({
            ...newProfile,
            email: session.user.email,
            unique_identifier: session.user.id
          });
        } else {
          // Add email from session
          setProfile({ 
            ...profileData, 
            email: session.user.email,
            unique_identifier: session.user.id
          });
        }
        
        console.log("[PDFData] Loading trusted persons");
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
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de vos données.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [toast]);

  return { profile, trustedPersons, loading };
}
