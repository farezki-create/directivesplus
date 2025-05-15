
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSignature = (userId?: string) => {
  const [signature, setSignature] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignature = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("user_signatures")
          .select("signature_data")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setSignature(data.signature_data);
        }
      } catch (error: any) {
        console.error("Error fetching signature:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSignature();
  }, [userId]);

  const saveSignature = async () => {
    if (!userId || !signature) return;

    try {
      const { error } = await supabase
        .from("user_signatures")
        .upsert(
          {
            user_id: userId,
            signature_data: signature,
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error("Error saving signature:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la signature",
        variant: "destructive",
      });
      return false;
    }
  };

  return { signature, setSignature, saveSignature, loading };
};
