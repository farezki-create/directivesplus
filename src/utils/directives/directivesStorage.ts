
import { savePdfToDatabase } from "@/utils/pdfStorage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DirectivesStorageOptions {
  userId: string;
  pdfOutput: string | null;
  description: string;
  profileData?: any;
}

/**
 * Sauvegarde les directives anticipées dans les deux emplacements :
 * - Dans la bibliothèque de documents personnels (pdf_documents)
 * - Dans le système d'accès par code (dossiers_medicaux)
 * 
 * @param options Options de stockage des directives
 * @returns Résultat de l'opération
 */
export const saveDirectivesWithDualStorage = async (
  options: DirectivesStorageOptions
): Promise<{ success: boolean; error?: string; documentId?: string }> => {
  try {
    // Vérifier si les données PDF sont disponibles
    if (!options.pdfOutput) {
      throw new Error("Aucune donnée PDF n'a été générée. Veuillez réessayer.");
    }
    
    // 1. Sauvegarde dans la bibliothèque personnelle (pdf_documents)
    const savedData = await savePdfToDatabase({
      userId: options.userId,
      pdfOutput: options.pdfOutput,
      description: options.description
    });
    
    console.log("Directives sauvegardées dans la bibliothèque personnelle:", savedData);
    
    // 2. Sauvegarde dans le système d'accès par code (dossiers_medicaux)
    // Vérifier si un code d'accès existe déjà pour cet utilisateur
    const { data: accessCodes } = await supabase
      .from('document_access_codes')
      .select('access_code')
      .eq('user_id', options.userId)
      .eq('is_full_access', false)
      .order('created_at', { ascending: false })
      .limit(1);
    
    let accessCode: string;
    
    if (accessCodes && accessCodes.length > 0) {
      accessCode = accessCodes[0].access_code;
      console.log("Utilisation du code d'accès existant:", accessCode);
    } else {
      // Générer un nouveau code d'accès si nécessaire
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      accessCode = randomCode;
      
      // Enregistrer le nouveau code d'accès
      const { error: accessCodeError } = await supabase
        .from('document_access_codes')
        .insert({
          user_id: options.userId,
          access_code: accessCode,
          is_full_access: false
        });
      
      if (accessCodeError) {
        console.error("Erreur lors de la création du code d'accès:", accessCodeError);
        throw new Error("Impossible de créer un code d'accès: " + accessCodeError.message);
      }
      
      console.log("Nouveau code d'accès généré:", accessCode);
    }
    
    // Créer le contenu du dossier médical avec les directives
    const dossierContent = {
      patient: {
        nom: options.profileData?.last_name || "Non renseigné",
        prenom: options.profileData?.first_name || "Non renseigné",
        date_naissance: options.profileData?.birth_date || null,
        adresse: options.profileData?.address || "Non renseignée",
        telephone: options.profileData?.phone_number || "Non renseigné"
      },
      directives_anticipees: {
        contenu: options.pdfOutput,
        date_creation: new Date().toISOString(),
        type_document: "pdf",
        description: options.description
      }
    };
    
    // Vérifier si un dossier existe déjà avec ce code d'accès
    const { data: existingDossier } = await supabase
      .from("dossiers_medicaux")
      .select("id")
      .eq("code_acces", accessCode)
      .maybeSingle();
    
    if (existingDossier) {
      // Mettre à jour le dossier existant
      const { error: updateError } = await supabase
        .from("dossiers_medicaux")
        .update({ contenu_dossier: dossierContent })
        .eq("code_acces", accessCode);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour du dossier médical:", updateError);
        throw new Error("Impossible de mettre à jour le dossier médical: " + updateError.message);
      }
      
      console.log("Dossier médical existant mis à jour avec les directives:", existingDossier.id);
    } else {
      // Autoriser l'insertion avec RLS en utilisant la fonction edge
      try {
        // Appeler la fonction edge pour créer le dossier en contournant la RLS
        const response = await fetch(`https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
          },
          body: JSON.stringify({
            isAuthUserRequest: true,
            userId: options.userId,
            bruteForceIdentifier: "directives_access_" + options.userId
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de la création du dossier via la fonction edge");
        }
        
        console.log("Dossier médical créé via la fonction edge:", result.dossier?.id);
      } catch (edgeError: any) {
        console.error("Erreur lors de l'appel à la fonction edge:", edgeError);
        // On continue malgré l'erreur car le PDF a été sauvegardé dans la bibliothèque personnelle
      }
    }
    
    return { 
      success: true, 
      documentId: savedData?.[0]?.id 
    };
  } catch (error: any) {
    console.error("Erreur lors du double enregistrement des directives:", error);
    return { 
      success: false, 
      error: error.message || "Une erreur s'est produite lors de l'enregistrement des directives" 
    };
  }
};

/**
 * Récupère le code d'accès directives pour un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Code d'accès ou null
 */
export const getDirectivesAccessCode = async (userId: string): Promise<string | null> => {
  try {
    const { data } = await supabase
      .from('document_access_codes')
      .select('access_code')
      .eq('user_id', userId)
      .eq('is_full_access', false)
      .order('created_at', { ascending: false })
      .limit(1);
    
    return data && data.length > 0 ? data[0].access_code : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du code d'accès:", error);
    return null;
  }
};
