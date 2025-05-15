
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      generateAccessCode();
    }
  }, [user]);

  const generateRandomCode = (length: number) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateAccessCode = async () => {
    if (!user) return;
    
    try {
      if (type === "medical") {
        // Pour l'accès médical, vérifier le profil de l'utilisateur
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('medical_access_code')
          .eq('id', user.id);
          
        if (profileError) {
          throw profileError;
        }
        
        // Si l'utilisateur a un code d'accès médical, l'utiliser
        if (profileData && profileData.length > 0 && profileData[0].medical_access_code) {
          setAccessCode(profileData[0].medical_access_code);
          return;
        }
        
        // Générer un nouveau code d'accès
        const newAccessCode = generateRandomCode(8);
        
        // Mettre à jour le profil avec le nouveau code d'accès
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ medical_access_code: newAccessCode })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        setAccessCode(newAccessCode);
      } else {
        // Pour l'accès aux directives, utiliser la table document_access_codes
        // Vérifier s'il existe un code pour cet utilisateur
        const { data, error } = await supabase
          .from('document_access_codes')
          .select('access_code')
          .eq('user_id', user.id)
          .is('document_id', null); // Ne récupérer que les codes d'accès généraux, pas les codes spécifiques à un document
          
        if (error) {
          throw error;
        }
          
        // Si nous avons un code d'accès, l'utiliser
        if (data && data.length > 0 && data[0].access_code) {
          setAccessCode(data[0].access_code);
          return;
        }
        
        // Générer un nouveau code d'accès
        const newAccessCode = generateRandomCode(8);
        
        // Créer un enregistrement dans document_access_codes
        const { error: insertError } = await supabase
          .from('document_access_codes')
          .insert({
            user_id: user.id,
            access_code: newAccessCode,
            is_full_access: true,
          });
          
        if (insertError) throw insertError;
        
        setAccessCode(newAccessCode);
      }
    } catch (error) {
      console.error(`Error retrieving access code for ${type}:`, error);
    }
  };

  return accessCode;
};
