
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export const generateRandomCode = (length: number = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  if (!user) return null;
  
  try {
    // Pour les deux types, générer un nouveau code d'accès
    const newAccessCode = generateRandomCode(8);
    console.log(`Génération d'un nouveau code d'accès pour ${type}:`, newAccessCode);
    
    if (type === "medical") {
      // Pour l'accès médical, mettre à jour le profil de l'utilisateur
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ medical_access_code: newAccessCode })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour du profil:", updateError);
        throw updateError;
      }
      
      console.log("Code d'accès médical sauvegardé avec succès");
      return newAccessCode;
    } else {
      // Pour l'accès aux directives, utiliser la table document_access_codes
      // Vérifier s'il existe un code pour cet utilisateur
      const { data, error } = await supabase
        .from('document_access_codes')
        .select('*')
        .eq('user_id', user.id)
        .is('document_id', null) // Ne récupérer que les codes d'accès généraux
        .limit(1);
      
      if (error) {
        console.error("Erreur lors de la vérification du code existant:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Mettre à jour le code existant
        const { error: updateError } = await supabase
          .from('document_access_codes')
          .update({ access_code: newAccessCode })
          .eq('id', data[0].id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du code existant:", updateError);
          throw updateError;
        }
      } else {
        // Créer un nouveau code s'il n'en existe pas
        const { error: insertError } = await supabase
          .from('document_access_codes')
          .insert({
            user_id: user.id,
            access_code: newAccessCode,
            is_full_access: true
          });
          
        if (insertError) {
          console.error("Erreur lors de la création du code d'accès:", insertError);
          throw insertError;
        }
      }
      
      console.log("Code d'accès aux directives sauvegardé avec succès");
      return newAccessCode;
    }
  } catch (error) {
    console.error(`Erreur lors de la génération du code d'accès pour ${type}:`, error);
    toast({
      title: "Erreur",
      description: `Impossible de générer le code d'accès pour vos ${type === "directive" ? "directives" : "données médicales"}`,
      variant: "destructive"
    });
    return null;
  }
};

export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAccessCode();
    }
  }, [user]);

  const fetchAccessCode = async () => {
    if (!user) return;
    
    try {
      if (type === "medical") {
        // Pour l'accès médical, vérifier le profil de l'utilisateur
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('medical_access_code')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          return;
        }
        
        // Si l'utilisateur a un code d'accès médical, l'utiliser
        if (profileData && profileData.medical_access_code) {
          console.log("Code d'accès médical existant trouvé:", profileData.medical_access_code);
          setAccessCode(profileData.medical_access_code);
        }
      } else {
        // Pour l'accès aux directives, utiliser la table document_access_codes
        // Vérifier s'il existe un code pour cet utilisateur
        const { data, error } = await supabase
          .from('document_access_codes')
          .select('access_code')
          .eq('user_id', user.id)
          .is('document_id', null) // Ne récupérer que les codes d'accès généraux
          .limit(1);
          
        if (error) {
          console.error("Erreur lors de la récupération du code d'accès:", error);
          return;
        }
          
        // Si nous avons un code d'accès, l'utiliser
        if (data && data.length > 0 && data[0].access_code) {
          console.log("Code d'accès aux directives existant trouvé:", data[0].access_code);
          setAccessCode(data[0].access_code);
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du code d'accès pour ${type}:`, error);
    }
  };

  return accessCode;
};
