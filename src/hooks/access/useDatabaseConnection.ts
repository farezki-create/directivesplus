
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDatabaseConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Check database connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Get the Supabase URL from client's configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kytqqjnecezkxyhmmjrz.supabase.co";
        console.log("URL Supabase:", supabaseUrl);
        
        // Simple test query to check if Supabase is responsive
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        
        if (error) {
          console.error("Erreur de connexion à la base de données:", error);
          setConnectionStatus("error");
          setDebugInfo({
            error: error,
            errorMessage: error.message,
            errorDetails: error.details,
            url: supabaseUrl,
            timestamp: new Date().toISOString()
          });
        } else if (data && data.length > 0) {
          console.log("Connexion à la base de données réussie, profil trouvé:", data);
          setConnectionStatus("success");
          setDebugInfo({
            profileFound: true,
            profileId: data[0].id,
            connectionUrl: supabaseUrl
          });
        } else {
          console.log("Connexion à la base de données réussie, mais aucun profil trouvé");
          
          // Attempt a different query to check other tables
          try {
            // Check other tables or run a count query instead of using rpc
            const tablesCheck = await supabase.from('profiles').select('count');
            console.log("Vérification de la table profiles:", tablesCheck);
          } catch (err) {
            console.error("Erreur lors de la vérification des tables:", err);
          }
          
          setConnectionStatus("warning");
          setDebugInfo({
            profileFound: false,
            message: "Aucun profil n'existe dans la base de données",
            connectionUrl: supabaseUrl
          });
        }
      } catch (err) {
        console.error("Exception lors de la vérification de connexion:", err);
        setConnectionStatus("error");
        setDebugInfo(err);
      }
    };
    
    checkConnection();
  }, []);

  return { connectionStatus, debugInfo };
};
