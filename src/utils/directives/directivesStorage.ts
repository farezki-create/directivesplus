import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { PatientInfo } from "./types";

/**
 * Generates a unique access code
 */
const generateAccessCode = async (): Promise<string> => {
  let code = uuidv4().substring(0, 8);
  
  // Check if the code already exists
  const { data, error } = await supabase
    .from('shared_documents')
    .select('access_code')
    .eq('access_code', code);

  if (error) {
    console.error("Error checking access code:", error);
    return code; // Return the code even if there's an error
  }

  // If the code exists, generate a new one recursively
  if (data && data.length > 0) {
    console.warn("Generated duplicate access code, retrying...");
    return generateAccessCode();
  }

  return code;
};

/**
 * Saves patient information to the database
 */
export const savePatientInfo = async (
  userId: string,
  patientInfo: PatientInfo
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: patientInfo.firstName,
        last_name: patientInfo.lastName,
        birth_date: patientInfo.birthDate,
        gender: patientInfo.gender,
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error saving patient info:", error);
    return { success: false, error: error.message };
  }
};

export const saveDirectivesWithDualStorage = async ({
  userId,
  pdfOutput,
  description,
  profileData,
  redirectToViewer = false
}: {
  userId: string;
  pdfOutput: string;
  description: string;
  profileData?: any;
  redirectToViewer?: boolean;
}): Promise<{ success: boolean; documentId?: string; accessCode?: string; error?: string }> => {
  console.log("=== DÉBUT SAUVEGARDE DIRECTIVES AVEC STOCKAGE DUAL ===");
  console.log("UserId:", userId);
  console.log("Description:", description);
  
  try {
    const fileName = `directives-anticipees-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Vérifier s'il existe déjà un document avec ce nom pour aujourd'hui
    const { data: existingDocs } = await supabase
      .from('pdf_documents')
      .select('id, file_name, created_at')
      .eq('user_id', userId)
      .eq('file_name', fileName)
      .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00.000Z')
      .lt('created_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + 'T00:00:00.000Z');

    let finalFileName = fileName;
    
    // Si un document existe déjà aujourd'hui, ajouter un suffixe
    if (existingDocs && existingDocs.length > 0) {
      const timestamp = new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }).replace(/:/g, 'h');
      finalFileName = `directives-anticipees-${new Date().toISOString().split('T')[0]}-${timestamp}.pdf`;
    }

    // Sauvegarder dans pdf_documents
    const { data: document, error: documentError } = await supabase
      .from('pdf_documents')
      .insert({
        file_name: finalFileName,
        file_path: pdfOutput,
        description: description,
        content_type: 'application/pdf',
        user_id: userId,
        file_size: Math.round(pdfOutput.length * 0.75) // Estimation de la taille
      })
      .select()
      .single();

    if (documentError) {
      throw new Error(`Erreur lors de la sauvegarde du document: ${documentError.message}`);
    }

    console.log("Document sauvegardé avec succès:", document.id);

    // Générer un code d'accès pour les directives partagées
    const accessCode = await generateAccessCode();
    
    // Sauvegarder aussi dans shared_documents pour l'accès public
    const { error: sharedError } = await supabase
      .from('shared_documents')
      .insert({
        document_id: document.id,
        document_type: 'directive',
        document_data: {
          file_name: finalFileName,
          file_path: pdfOutput,
          description: description,
          content_type: 'application/pdf',
          user_id: userId
        },
        user_id: userId,
        access_code: accessCode
      });

    if (sharedError) {
      console.error("Erreur lors de la sauvegarde partagée:", sharedError);
      // Ne pas faire échouer la sauvegarde principale
    }

    return {
      success: true,
      documentId: document.id,
      accessCode: accessCode
    };

  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
