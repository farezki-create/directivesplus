
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
      const tableField = type === "directive" ? "is_directive_access" : "is_medical_access";
      
      // Vérifier si l'utilisateur a déjà un code d'accès du type demandé
      const { data, error } = await supabase
        .from('document_access_codes')
        .select('access_code')
        .eq('user_id', user.id)
        .eq(tableField, true)
        .maybeSingle();
        
      if (data?.access_code) {
        setAccessCode(data.access_code);
        return;
      }
      
      // Générer un nouveau code d'accès si aucun n'existe
      const newAccessCode = generateRandomCode(8);
      
      // Créer un enregistrement dans document_access_codes
      await supabase
        .from('document_access_codes')
        .insert({
          user_id: user.id,
          access_code: newAccessCode,
          is_directive_access: type === "directive",
          is_medical_access: type === "medical",
        });
        
      setAccessCode(newAccessCode);
    } catch (error) {
      console.error(`Erreur lors de la récupération du code d'accès pour ${type}:`, error);
    }
  };

  return accessCode;
};
