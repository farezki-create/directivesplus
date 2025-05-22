
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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
  };
}

export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Verify an access code
   * @param accessCode Access code to verify
   * @param bruteForceIdentifier Identifier for brute force protection
   * @returns Dossier if code is valid
   */
  const verifierCode = async (accessCode: string, bruteForceIdentifier?: string): Promise<Dossier | null> => {
    console.log(`Verifying access code: ${accessCode} (Identifier: ${bruteForceIdentifier || 'none'})`);
    
    setLoading(true);
    try {
      // Call the actual Edge Function
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
      
      const result = await response.json();
      
      if (!result.success) {
        console.error("Error verifying access code:", result.error);
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
      // Call the Edge Function with user ID
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
      
      const result = await response.json();
      
      if (!result.success) {
        console.error("Error getting authenticated user dossier:", result.error);
        return null;
      }
      
      return result.dossier;
    } catch (error) {
      console.error("Error getting authenticated user dossier:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération du dossier",
        variant: "destructive"
      });
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
