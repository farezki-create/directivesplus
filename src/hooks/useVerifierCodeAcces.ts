
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Dossier {
  id: string;
  userId: string;
  contenu: any;
  profileData?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState(false);

  const verifierCode = async (accessCode: string, bruteForceIdentifier: string): Promise<Dossier | null> => {
    setLoading(true);
    try {
      const apiUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces";
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: accessCode,
          bruteForceIdentifier: bruteForceIdentifier
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.dossier) {
        return result.dossier;
      } else {
        toast({
          title: "Code d'accès invalide",
          description: result.error || "Le code d'accès fourni n'est pas valide",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDossierUtilisateurAuthentifie = async (userId: string, type: string): Promise<Dossier | null> => {
    try {
      // Simuler la récupération d'un dossier pour utilisateur authentifié
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.id,
        contenu: { documents: [] },
        profileData: {
          first_name: data.first_name,
          last_name: data.last_name,
          birth_date: data.birth_date
        }
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du dossier utilisateur:", error);
      return null;
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie,
    loading
  };
};
