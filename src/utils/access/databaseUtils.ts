
import { supabase } from "@/integrations/supabase/client";
import { AccessCodeCheckResult } from "@/hooks/directives-access/types";

// Check database connection
export const checkDatabaseConnection = async (): Promise<AccessCodeCheckResult> => {
  try {
    // Check first if database connection is working
    const connectionTest = await supabase.from('profiles').select('id').limit(1);
    
    // Log the connection information for debugging
    console.log("Test de connexion à la base de données:", {
      error: connectionTest.error,
      data: connectionTest.data,
      status: connectionTest.status,
      statusText: connectionTest.statusText,
      count: connectionTest.count
    });
    
    // Handle database connection error
    if (connectionTest.error) {
      console.error("Erreur de connexion à la base de données:", connectionTest.error);
      return { 
        data: [], 
        error: "Erreur de connexion à la base de données",
        details: connectionTest.error
      };
    }
    
    // Handle case when no profiles exist in the database
    if (!connectionTest.data || connectionTest.data.length === 0) {
      console.warn("Aucun profil n'existe dans la base de données");
      
      // Essayer une requête sans filtres pour vérifier si la table existe
      try {
        const tableCheck = await supabase.from('profiles').select('count');
        console.log("Vérification de la table profiles:", tableCheck);
        
        // Vérifier les paramètres de connexion à Supabase
        console.log("URL Supabase:", supabase.supabaseUrl);
      } catch (err) {
        console.error("Erreur lors de la vérification de la table:", err);
      }
      
      // Return a consistent error object with noProfiles flag
      return { 
        data: [], 
        error: "Aucun profil n'existe dans la base de données",
        noProfiles: true
      };
    }
    
    // Connection is working and profiles exist
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
