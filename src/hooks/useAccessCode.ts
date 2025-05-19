
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { generateStandardAccessCode, createNewAccessCode } from "@/utils/access/codeFormatters";
import { toast } from "@/hooks/use-toast";

export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      generateAccessCode();
    }
  }, [user]);

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
        
        // Générer un nouveau code d'accès standardisé
        const newCode = await createNewAccessCode(user.id, true);
        if (newCode) {
          setAccessCode(newCode);
        } else {
          // Fallback sur l'ancien générateur si la création a échoué
          const fallbackCode = generateStandardAccessCode(8);
          
          // Mettre à jour le profil avec le nouveau code d'accès
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ medical_access_code: fallbackCode })
            .eq('id', user.id);
            
          if (updateError) throw updateError;
          
          setAccessCode(fallbackCode);
        }
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
        
        // Générer un nouveau code d'accès standardisé
        const newCode = await createNewAccessCode(user.id, false);
        if (newCode) {
          setAccessCode(newCode);
        } else {
          // Fallback sur l'ancien générateur si la création a échoué
          const fallbackCode = generateStandardAccessCode(10);
          
          // Créer un enregistrement dans document_access_codes
          const { error: insertError } = await supabase
            .from('document_access_codes')
            .insert({
              user_id: user.id,
              access_code: fallbackCode,
              is_full_access: true,
            });
            
          if (insertError) throw insertError;
          
          setAccessCode(fallbackCode);
        }
      }
    } catch (error) {
      console.error(`Error retrieving access code for ${type}:`, error);
    }
  };

  const regenerateAccessCode = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const newCode = generateStandardAccessCode(8);
      
      if (type === "medical") {
        // Mettre à jour le code d'accès médical dans le profil
        const { error } = await supabase
          .from('profiles')
          .update({ medical_access_code: newCode })
          .eq('id', user.id);
          
        if (error) throw error;
        
        setAccessCode(newCode);
        toast({
          title: "Succès",
          description: "Votre code d'accès médical a été régénéré",
        });
      } else {
        // Pour les directives, mettre à jour le code dans document_access_codes
        const { data, error: selectError } = await supabase
          .from('document_access_codes')
          .select('id')
          .eq('user_id', user.id)
          .is('document_id', null)
          .limit(1);
          
        if (selectError) throw selectError;
        
        if (data && data.length > 0) {
          // Mettre à jour le code existant
          const { error } = await supabase
            .from('document_access_codes')
            .update({ access_code: newCode })
            .eq('id', data[0].id);
            
          if (error) throw error;
        } else {
          // Créer un nouveau code si aucun n'existe
          const { error } = await supabase
            .from('document_access_codes')
            .insert({
              user_id: user.id,
              access_code: newCode,
              is_full_access: true,
            });
            
          if (error) throw error;
        }
        
        setAccessCode(newCode);
        toast({
          title: "Succès",
          description: "Votre code d'accès aux directives a été régénéré",
        });
      }
    } catch (error) {
      console.error(`Error regenerating access code for ${type}:`, error);
      toast({
        title: "Erreur",
        description: `Impossible de régénérer le code d'accès: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { accessCode, regenerateAccessCode, isLoading };
};
