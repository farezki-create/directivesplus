
import { savePdfToDatabase } from "@/utils/pdfStorage";
import { supabase } from "@/integrations/supabase/client";

interface DirectivesStorageOptions {
  userId: string;
  pdfOutput: string | null;
  description: string;
  profileData?: any;
  redirectToViewer?: boolean;
}

export const saveDirectivesWithDualStorage = async (
  options: DirectivesStorageOptions
): Promise<{ success: boolean; error?: string; documentId?: string; accessCode?: string }> => {
  try {
    if (!options.pdfOutput) {
      throw new Error("Aucune donnée PDF n'a été générée. Veuillez réessayer.");
    }
    
    // 1. Supprimer l'ancien document de directives anticipées dans pdf_documents
    try {
      const { error: deleteError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('user_id', options.userId)
        .ilike('description', '%directives anticipées%');
      
      if (deleteError) {
        console.warn("Erreur lors de la suppression de l'ancien document:", deleteError);
      }
    } catch (deleteErr) {
      console.warn("Erreur lors de la suppression de l'ancien document:", deleteErr);
    }
    
    // 2. Sauvegarde du nouveau document dans la bibliothèque personnelle (pdf_documents)
    const savedData = await savePdfToDatabase({
      userId: options.userId,
      pdfOutput: options.pdfOutput,
      description: options.description
    });
    
    // 3. Sauvegarde dans le système d'accès par code (dossiers_medicaux)
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
    } else {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      accessCode = randomCode;
      
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
    }
    
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
    
    const { data: existingDossier } = await supabase
      .from("dossiers_medicaux")
      .select("id")
      .eq("code_acces", accessCode)
      .maybeSingle();
    
    if (existingDossier) {
      const { error: updateError } = await supabase
        .from("dossiers_medicaux")
        .update({ contenu_dossier: dossierContent })
        .eq("code_acces", accessCode);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour du dossier médical:", updateError);
        throw new Error("Impossible de mettre à jour le dossier médical: " + updateError.message);
      }
    } else {
      const { error: insertError } = await supabase
        .from("dossiers_medicaux")
        .insert({
          code_acces: accessCode,
          contenu_dossier: dossierContent
        });
      
      if (insertError) {
        console.error("Erreur lors de la création du dossier médical:", insertError);
        if (!insertError.message.includes("row-level security policy")) {
          throw new Error("Impossible de créer le dossier médical: " + insertError.message);
        }
      }
    }
    
    return { 
      success: true, 
      documentId: savedData?.[0]?.id,
      accessCode
    };
  } catch (error: any) {
    console.error("Erreur lors du double enregistrement des directives:", error);
    return { 
      success: false, 
      error: error.message || "Une erreur s'est produite lors de l'enregistrement des directives" 
    };
  }
};

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
