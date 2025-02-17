
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, TrustedPerson } from "./types";
import { useToast } from "@/hooks/use-toast";

export function usePDFData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [responses, setResponses] = useState<any>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        console.log("[PDFGenerator] Loading user profile");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        
        // Add email from session and create a valid UserProfile object
        if (profileData) {
          setProfile({
            ...profileData,
            email: session.user.email || undefined
          });
        }

        console.log("[PDFGenerator] Loading trusted persons");
        const { data: trustedPersonsData, error: trustedPersonsError } = await supabase
          .from("trusted_persons")
          .select("*")
          .eq("user_id", session.user.id);

        if (trustedPersonsError) throw trustedPersonsError;
        setTrustedPersons(trustedPersonsData || []);

        console.log("[PDFGenerator] Loading responses");
        const { data: responsesData, error: responsesError } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (responsesError) throw responsesError;
        setResponses(responsesData || { free_text: null });

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

  return { profile, responses, trustedPersons, setTrustedPersons, loading };
}
