
import { Dispatch, SetStateAction } from "react";
import { getAuthUserDossier } from "@/api/dossier/userDossierAccess";
import type { Dossier } from "../types/dossierTypes";

/**
 * Hook for getting authenticated user dossier
 */
export const useAuthenticatedDossier = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  /**
   * Get dossier for authenticated user
   */
  const getDossierAuthenticated = async (userId: string, accessType?: string): Promise<Dossier | null> => {
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
      return await getDossierWithEdgeFunction(userId, accessType);
    } catch (error) {
      console.error("Error getting authenticated user dossier:", error);
      // Don't show toast for this error since we'll handle it in the UI
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fallback to Edge function for getting user dossier
   */
  const getDossierWithEdgeFunction = async (userId: string, accessType?: string): Promise<Dossier | null> => {
    try {
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
      
      // Ensure userId is set
      if (edgeResult.dossier) {
        edgeResult.dossier.userId = edgeResult.dossier.userId || "";
      }
      
      return edgeResult.dossier;
    } catch (error) {
      console.error("Error in edge function dossier retrieval:", error);
      return null;
    }
  };

  return {
    getDossierAuthenticated
  };
};
