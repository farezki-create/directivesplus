
import { Dispatch, SetStateAction } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Dossier } from "../types/dossierTypes";

/**
 * Hook for verifying access codes
 */
export const useCodeVerification = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  /**
   * Verify an access code using RPC function
   * @param accessCode Access code to verify
   * @param bruteForceIdentifier Identifier for brute force protection (format: firstname_lastname)
   * @returns Dossier if code is valid
   */
  const verifyCode = async (accessCode: string, bruteForceIdentifier?: string): Promise<Dossier | null> => {
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
            userId: profile.user_id || "", // Ensure userId is set, using empty string as fallback
            isFullAccess: true,
            isDirectivesOnly: true,
            isMedicalOnly: false,
            profileData: {
              first_name: profile.first_name || "",
              last_name: profile.last_name || "",
              birth_date: profile.birthdate || ""
            },
            contenu: {
              patient: {
                nom: profile.last_name || "",
                prenom: profile.first_name || "",
                date_naissance: profile.birthdate || null
              }
            }
          };
          
          return dossier;
        }
      }
      
      // If RPC verification failed or we don't have complete user info, fall back to Edge function
      return await verifyCodeWithEdgeFunction(accessCode, bruteForceIdentifier);
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
   * Fallback verification using Edge function
   */
  const verifyCodeWithEdgeFunction = async (accessCode: string, bruteForceIdentifier?: string): Promise<Dossier | null> => {
    console.log("Falling back to Edge function verification");
    try {
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
      
      // Ensure userId is set in the dossier from edge function
      if (result.dossier) {
        result.dossier.userId = result.dossier.userId || "";
        
        // Ensure profileData fields are set
        if (result.dossier.profileData) {
          result.dossier.profileData.first_name = result.dossier.profileData.first_name || "";
          result.dossier.profileData.last_name = result.dossier.profileData.last_name || "";
          result.dossier.profileData.birth_date = result.dossier.profileData.birth_date || "";
        }
      }
      
      return result.dossier;
    } catch (error) {
      console.error("Error in edge function verification:", error);
      return null;
    }
  };

  return {
    verifyCode
  };
};
