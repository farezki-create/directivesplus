
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("[PDFGenerator] No user session");
          setLoading(false);
          return;
        }

        console.log("[PDFGenerator] Loading user profile for:", session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("[PDFGenerator] Error loading profile:", profileError);
          throw profileError;
        }
        
        // Add email and unique_identifier from session
        setProfile({ 
          ...profileData, 
          email: session.user.email,
          unique_identifier: session.user.id // Using user id as unique identifier
        });

        console.log("[PDFGenerator] Loading trusted persons");
        const { data: trustedPersonsData, error: trustedPersonsError } = await supabase
          .from("trusted_persons")
          .select("*")
          .eq("user_id", session.user.id);

        if (trustedPersonsError) {
          console.error("[PDFGenerator] Error loading trusted persons:", trustedPersonsError);
          throw trustedPersonsError;
        }
        setTrustedPersons(trustedPersonsData || []);

      } catch (error) {
        console.error("[PDFGenerator] Error loading user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données.",
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
