
import { supabase } from "@/integrations/supabase/client";
import { ConnectionCheckResult } from "./types";

// Vérifier la connexion à la base de données
export const verifyDatabaseConnection = async (): Promise<ConnectionCheckResult> => {
  try {
    const connectionTest = await supabase.from('profiles').select('count').limit(1);
    if (connectionTest.error) {
      console.error("Erreur de connexion à la base de données:", connectionTest.error);
      return {
        isValid: false,
        error: "Erreur de connexion à la base de données. Veuillez réessayer plus tard."
      };
    }
    return { isValid: true };
  } catch (error) {
    console.error("Exception lors de la vérification de la connexion:", error);
    return {
      isValid: false,
      error: "Erreur de connexion à la base de données. Veuillez réessayer plus tard."
    };
  }
};
