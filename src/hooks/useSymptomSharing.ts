
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSymptomSharing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateShareCode = async (expiryDays: number = 30) => {
    if (!user?.id) {
      setError("Utilisateur non connecté");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Générer un nouveau code d'accès
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_symptom_access_code');

      if (codeError) {
        console.error("Erreur lors de la génération du code:", codeError);
        setError("Erreur lors de la génération du code");
        return null;
      }

      const shareCode = codeData;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      // Mettre à jour tous les symptômes existants du patient
      const { error: updateError } = await supabase
        .from("symptom_tracking")
        .update({
          symptome_access_code: shareCode,
          shared_access_expires_at: expiryDate.toISOString()
        })
        .eq("patient_id", user.id);

      if (updateError) {
        console.error("Erreur lors de la mise à jour:", updateError);
        setError("Erreur lors de l'activation du partage");
        return null;
      }

      return shareCode;

    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const revokeShareCode = async () => {
    if (!user?.id) {
      setError("Utilisateur non connecté");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("symptom_tracking")
        .update({
          symptome_access_code: null,
          shared_access_expires_at: null
        })
        .eq("patient_id", user.id);

      if (error) {
        console.error("Erreur lors de la révocation:", error);
        setError("Erreur lors de la révocation du partage");
        return false;
      }

      return true;

    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur inattendue");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getShareStatus = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from("symptom_tracking")
        .select("symptome_access_code, shared_access_expires_at")
        .eq("patient_id", user.id)
        .not("symptome_access_code", "is", null)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erreur lors de la récupération du statut:", error);
        return null;
      }

      return data;

    } catch (err) {
      console.error("Erreur:", err);
      return null;
    }
  };

  return {
    generateShareCode,
    revokeShareCode,
    getShareStatus,
    loading,
    error
  };
};
