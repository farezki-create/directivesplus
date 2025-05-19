
import { supabase } from "@/integrations/supabase/client";

// Check database connection
export const checkDatabaseConnection = async () => {
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

// Find the first available profile (for test mode)
export const searchFirstAvailableProfile = async (reason: string) => {
  // Get any available profile for demo mode
  const { data: demoProfiles, error } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error("Erreur lors de la recherche d'un profil de démo:", error);
    return {
      data: [],
      error: "Erreur lors de la recherche d'un profil de démo",
      details: error
    };
  }
    
  if (demoProfiles && demoProfiles.length > 0) {
    console.log("Profil de démo trouvé:", demoProfiles[0].id);
    return { data: [{ user_id: demoProfiles[0].id }], error: null };
  } else {
    console.error("Aucun profil disponible pour le mode démo");
    return { 
      data: [], 
      error: "Aucun profil disponible pour le mode démo",
      noProfiles: true
    };
  }
};
