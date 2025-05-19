
import { supabase } from "@/integrations/supabase/client";
import { AccessCodeCheckResult } from "./accessCodeSearch";

// Check database connection
export const checkDatabaseConnection = async (): Promise<AccessCodeCheckResult> => {
  try {
    // Check first if database connection is working
    const connectionTest = await supabase.from('profiles').select('id').limit(1);
    if (connectionTest.error) {
      console.error("Erreur de connexion à la base de données:", connectionTest.error);
      return { 
        data: [], 
        error: "Erreur de connexion à la base de données",
        details: connectionTest.error
      };
    }
    
    // No profiles found in the database
    if (!connectionTest.data || connectionTest.data.length === 0) {
      console.warn("Aucun profil n'existe dans la base de données");
      return { 
        data: [], 
        error: "Aucun profil n'existe dans la base de données",
        noProfiles: true
      };
    }
    
    return { data: connectionTest.data, error: null };
  } catch (err) {
    console.error("Exception lors de la vérification de la connexion:", err);
    return {
      data: [],
      error: "Exception lors de la vérification de la connexion à la base de données",
      details: err
    };
  }
};
