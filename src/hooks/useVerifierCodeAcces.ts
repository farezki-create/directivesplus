
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getAuthUserDossier } from "@/api/dossier/userDossierAccess";
import { supabase } from "@/integrations/supabase/client";

export interface Dossier {
  id: string;
  userId: string;
  isFullAccess: boolean;
  isDirectivesOnly: boolean;
  isMedicalOnly: boolean;
  profileData: {
    first_name: string;
    last_name: string;
    birth_date: string;
  };
  contenu: {
    document_url?: string;
    documents?: any[];
    patient?: {
      nom: string;
      prenom: string;
      date_naissance: string | null;
    };
  };
}

export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Verify an access code using RPC function
   * @param accessCode Access code to verify
   * @param bruteForceIdentifier Identifier for brute force protection (format: firstname_lastname)
   * @returns Dossier if code is valid
   */
  const verifierCode = async (accessCode: string, bruteForceIdentifier?: string): Promise<Dossier | null> => {
    console.log(`Verifying access code: ${accessCode} (Identifier: ${bruteForceIdentifier || 'none'})`);
    
    if (!accessCode) {
      console.error("No access code provided");
      return null;
    }
    
    setLoading(true);
    try {
      // Parse the bruteForceIdentifier to get lastName and firstName if available
      let firstName = '', lastName = '';
      if (bruteForceIdentifier && bruteForceIdentifier.includes('_')) {
        [firstName, lastName] = bruteForceIdentifier.split('_');
      }

      // First try to verify using RPC function if we have complete user info
      if (firstName && lastName) {
        console.log(`Attempting to verify using RPC with firstName=${firstName}, lastName=${lastName}`);
        
        // Call the RPC function to verify access
        const { data, error } = await supabase.rpc('verify_access_identity', {
          input_lastname: lastName,
          input_firstname: firstName,
          input_birthdate: null, // We might not have birthdate
          input_access_code: accessCode,
        });
        
        if (error) {
          console.error("RPC verification error:", error);
        } else if (data && data.length > 0) {
          console.log("Successfully verified access via RPC:", data);
          
          // Create dossier from the returned profile data
          const profile = data[0];
          const dossier: Dossier = {
            id: profile.id,
            userId: profile.user_id,
            isFullAccess: true,
            isDirectivesOnly: true,
            isMedicalOnly: false,
            profileData: {
              first_name: profile.first_name,
              last_name: profile.last_name,
              birth_date: profile.birthdate
            },
            contenu: {
              patient: {
                nom: profile.last_name,
                prenom: profile.first_name,
                date_naissance: profile.birthdate
              }
            }
          };
          
          return dossier;
        }
      }
      
      // If RPC verification failed or we don't have complete user info, fall back to Edge function
      console.log("Falling back to Edge function verification");
      const apiUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces";
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: accessCode,
          bruteForceIdentifier: bruteForceIdentifier || "direct_access"
        })
      });
      
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`, await response.text());
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Edge function response:", result);
      
      if (!result.success) {
        console.error("Error verifying access code:", result.error);
        toast({
          title: "Erreur",
          description: result.error || "Code d'accès invalide ou expiré",
          variant: "destructive"
        });
        return null;
      }
      
      return result.dossier;
    } catch (error) {
      console.error("Error verifying access code:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code d'accès",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get dossier for authenticated user
   */
  const getDossierUtilisateurAuthentifie = async (userId: string, accessType?: string): Promise<Dossier | null> => {
    console.log(`Getting dossier for authenticated user: ${userId} (Type: ${accessType || 'full'})`);
    
    setLoading(true);
    try {
      // First try to use the local API function rather than the edge function
      const result = await getAuthUserDossier(userId, accessType as "medical" | "directive");
      
      if (result.success && result.dossier) {
        console.log("Successfully loaded dossier from local API:", result.dossier);
        return result.dossier;
      }
      
      // Fallback to the Edge Function with user ID if local API fails
      const apiUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces";
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          accessType: accessType || "full"
        })
      });
      
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`, await response.text());
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const edgeResult = await response.json();
      
      if (!edgeResult.success) {
        console.error("Error getting authenticated user dossier:", edgeResult.error);
        return null;
      }
      
      console.log("Successfully loaded dossier from edge function:", edgeResult.dossier);
      return edgeResult.dossier;
    } catch (error) {
      console.error("Error getting authenticated user dossier:", error);
      // Don't show toast for this error since we'll handle it in the UI
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie,
    loading
  };
};
