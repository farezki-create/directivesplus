
import { savePdfToDatabase } from "@/utils/pdfStorage";
import { supabase } from "@/integrations/supabase/client";

interface DirectivesStorageOptions {
  userId: string;
  pdfOutput: string | null;
  description: string;
  profileData?: any;
  redirectToViewer?: boolean; // New option to redirect after saving
}

/**
 * Sauvegarde les directives anticipées dans les deux emplacements :
 * - Dans la bibliothèque de documents personnels (pdf_documents)
 * - Dans le système d'accès par code (dossiers_medicaux)
 * 
 * IMPORTANT: Supprime automatiquement l'ancien document de directives anticipées
 * pour maintenir un seul document unique.
 * 
 * @param options Options de stockage des directives
 * @returns Résultat de l'opération
 */
export const saveDirectivesWithDualStorage = async (
  options: DirectivesStorageOptions
): Promise<{ success: boolean; error?: string; documentId?: string; accessCode?: string }> => {
  try {
    // Vérifier si les données PDF sont disponibles
    if (!options.pdfOutput) {
      throw new Error("Aucune donnée PDF n'a été générée. Veuillez réessayer.");
    }
    
    console.log("=== SUPPRESSION DE L'ANCIEN DOCUMENT DE DIRECTIVES ===");
    
    // 1. Supprimer l'ancien document de directives anticipées dans pdf_documents
    try {
      const { error: deleteError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('user_id', options.userId)
        .ilike('description', '%directives anticipées%');
      
      if (deleteError) {
        console.warn("Erreur lors de la suppression de l'ancien document:", deleteError);
        // Ne pas arrêter le processus, juste logger l'erreur
      } else {
        console.log("Ancien document de directives supprimé avec succès");
      }
    } catch (deleteErr) {
      console.warn("Erreur lors de la suppression de l'ancien document:", deleteErr);
      // Continue le processus même si la suppression échoue
    }
    
    console.log("=== SAUVEGARDE DU NOUVEAU DOCUMENT ===");
    
    // 2. Sauvegarde du nouveau document dans la bibliothèque personnelle (pdf_documents)
    const savedData = await savePdfToDatabase({
      userId: options.userId,
      pdfOutput: options.pdfOutput,
      description: options.description
    });
    
    console.log("Nouvelles directives sauvegardées dans la bibliothèque personnelle:", savedData);
    
    // 3. Sauvegarde dans le système d'accès par code (dossiers_medicaux)
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
    
    // Créer le contenu du dossier médical avec les nouvelles directives
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
      // Mettre à jour le dossier existant avec les nouvelles directives
      const { error: updateError } = await supabase
        .from("dossiers_medicaux")
        .update({ contenu_dossier: dossierContent })
        .eq("code_acces", accessCode);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour du dossier médical:", updateError);
        throw new Error("Impossible de mettre à jour le dossier médical: " + updateError.message);
      }
      
      console.log("Dossier médical existant mis à jour avec les nouvelles directives:", existingDossier.id);
    } else {
      // Créer un nouveau dossier médical
      const { error: insertError } = await supabase
        .from("dossiers_medicaux")
        .insert({
          code_acces: accessCode,
          contenu_dossier: dossierContent
        });
      
      if (insertError) {
        console.error("Erreur lors de la création du dossier médical:", insertError);
        if (insertError.message.includes("row-level security policy")) {
          // L'erreur est liée à la politique de sécurité RLS, mais le PDF est déjà sauvegardé
          console.log("Erreur RLS ignorée, le PDF est sauvegardé dans la bibliothèque personnelle");
        } else {
          throw new Error("Impossible de créer le dossier médical: " + insertError.message);
        }
      }
    }
    
    console.log("=== SAUVEGARDE TERMINÉE AVEC SUCCÈS ===");
    console.log("Ancien document supprimé, nouveau document créé avec ID:", savedData?.[0]?.id);
    
    return { 
      success: true, 
      documentId: savedData?.[0]?.id,
      accessCode: accessCode // Retourner le code d'accès pour permettre la redirection
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
