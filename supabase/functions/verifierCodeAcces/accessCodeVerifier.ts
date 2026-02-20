import { determineAccessType } from "./accessTypeUtils.ts";
import { fetchUserProfile } from "./profileService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { StandardResponse } from "./types.ts";

/**
 * Main function to verify access code using different methods
 */
export async function verifyAccessCode(
  supabase: any,
  accessCode: string,
  bruteForceIdentifier?: string,
  patientName?: string,
  patientBirthDate?: string
): Promise<StandardResponse> {
  let firstName = '', lastName = '';
  if (bruteForceIdentifier && bruteForceIdentifier.includes('_')) {
    const parts = bruteForceIdentifier.split('_');
    if (parts.length >= 3) {
      firstName = parts[2] || '';
      lastName = parts[3] || '';
    } else if (parts.length >= 2) {
      firstName = parts[0] || '';
      lastName = parts[1] || '';
    }
  }

  // First try with RPC function if we have name components
  if (firstName && lastName) {
    try {
      const { data: sharedProfiles, error: rpcError } = await supabase.rpc(
        'verify_access_identity',
        {
          input_lastname: lastName,
          input_firstname: firstName,
          input_birthdate: null,
          input_access_code: accessCode,
        }
      );
      
      if (rpcError) {
        console.error("Error with RPC verification:", rpcError);
      } else if (sharedProfiles && sharedProfiles.length > 0) {
        const profile = sharedProfiles[0];
        const realUserId = profile.user_id;
        
        const { data: pdfDocuments, error: pdfDocsError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', realUserId)
          .order('created_at', { ascending: false });
        
        if (pdfDocsError) {
          console.error("Error fetching PDF documents:", pdfDocsError);
        }
        
        const { data: directivesDocuments, error: directivesDocsError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', realUserId)
          .order('created_at', { ascending: false });
        
        if (directivesDocsError) {
          console.error("Error fetching directives documents:", directivesDocsError);
        } else {
          const authenticDirectives = directivesDocuments?.filter(doc => {
            const content = doc.content;
            const isTestData = (
              content?.title?.toLowerCase().includes('test') ||
              content?.titre?.toLowerCase().includes('test') ||
              content?.content?.toLowerCase().includes('test') ||
              content?.contenu?.toLowerCase().includes('test') ||
              content?.created_for_institution_access === true
            );
            return !isTestData;
          }) || [];
          
          const allDocuments = [
            ...(pdfDocuments || []).map(doc => ({
              ...doc,
              file_type: doc.content_type || 'application/pdf',
              source: 'pdf_documents'
            })),
            ...authenticDirectives.map(doc => ({
              id: doc.id,
              file_name: doc.content?.title || doc.content?.titre || 'Directive anticipée',
              file_path: doc.id,
              created_at: doc.created_at,
              updated_at: doc.updated_at,
              description: 'Directive anticipée authentique',
              content_type: 'application/json',
              file_type: 'directive',
              user_id: doc.user_id,
              content: doc.content,
              source: 'directives'
            }))
          ];
          
          const accessTypeInfo = determineAccessType(bruteForceIdentifier);
          
          const dossier = {
            id: profile.id,
            userId: realUserId,
            isFullAccess: true,
            isDirectivesOnly: accessTypeInfo.isDirectivesOnly,
            isMedicalOnly: accessTypeInfo.isMedicalOnly,
            profileData: {
              first_name: profile.first_name,
              last_name: profile.last_name,
              birth_date: profile.birthdate
            },
            contenu: {
              documents: allDocuments,
              patient: {
                nom: profile.last_name,
                prenom: profile.first_name,
                date_naissance: profile.birthdate
              }
            }
          };
          
          await logAccessAttempt(
            supabase,
            realUserId,
            true,
            `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}, Documents authentiques: ${allDocuments.length}`
          );
          
          return {
            success: true,
            dossier
          };
        }
      }
    } catch (rpcError) {
      console.error("Exception during RPC verification:", rpcError);
    }
  }

  // Standard verification with shared profiles
  const { data: sharedProfiles, error: sharedProfileError } = await supabase
    .from('shared_profiles')
    .select('*')
    .eq('access_code', accessCode);

  if (sharedProfileError) {
    console.error("Error fetching shared profile:", sharedProfileError);
  }

  if (sharedProfiles && sharedProfiles.length > 0) {
    const profile = sharedProfiles[0];
    const realUserId = profile.user_id;
    
    const { data: pdfDocuments, error: pdfDocsError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', realUserId)
      .order('created_at', { ascending: false });
    
    if (pdfDocsError) {
      console.error("Error fetching PDF documents:", pdfDocsError);
    }
    
    const { data: directivesDocuments, error: directivesDocsError } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', realUserId)
      .order('created_at', { ascending: false });
    
    if (directivesDocsError) {
      console.error("Error fetching directives documents:", directivesDocsError);
    } else {
      const authenticDirectives = directivesDocuments?.filter(doc => {
        const content = doc.content;
        const isTestData = (
          content?.title?.toLowerCase().includes('test') ||
          content?.titre?.toLowerCase().includes('test') ||
          content?.content?.toLowerCase().includes('test') ||
          content?.contenu?.toLowerCase().includes('test') ||
          content?.created_for_institution_access === true
        );
        return !isTestData;
      }) || [];
      
      const allDocuments = [
        ...(pdfDocuments || []).map(doc => ({
          ...doc,
          file_type: doc.content_type || 'application/pdf',
          source: 'pdf_documents'
        })),
        ...authenticDirectives.map(doc => ({
          id: doc.id,
          file_name: doc.content?.title || doc.content?.titre || 'Directive anticipée',
          file_path: doc.id,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          description: 'Directive anticipée authentique',
          content_type: 'application/json',
          file_type: 'directive',
          user_id: doc.user_id,
          content: doc.content,
          source: 'directives'
        }))
      ];
      
      const accessTypeInfo = determineAccessType(bruteForceIdentifier);
      
      const dossier = {
        id: profile.id,
        userId: realUserId,
        isFullAccess: true,
        isDirectivesOnly: accessTypeInfo.isDirectivesOnly,
        isMedicalOnly: accessTypeInfo.isMedicalOnly,
        profileData: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: profile.birthdate
        },
        contenu: {
          documents: allDocuments,
          patient: {
            nom: profile.last_name,
            prenom: profile.first_name,
            date_naissance: profile.birthdate
          }
        }
      };
      
      await logAccessAttempt(
        supabase,
        realUserId,
        true,
        `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}, Documents authentiques: ${allDocuments.length}`
      );
      
      return {
        success: true,
        dossier
      };
    }
  }

  // Try with medical dossiers
  const { data: dossierMedical, error: dossierError } = await supabase
    .from('dossiers_medicaux')
    .select('*')
    .eq('code_acces', accessCode);
    
  if (dossierError) {
    console.error("Error fetching dossier:", dossierError);
  }

  if (dossierMedical && dossierMedical.length > 0) {
    const dossier = dossierMedical[0];
    
    await logAccessAttempt(
      supabase,
      null,
      true,
      `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`,
      dossier.id
    );
    
    return {
      success: true,
      dossier: {
        id: dossier.id,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        contenu: dossier.contenu_dossier
      }
    };
  }

  return {
    success: false,
    error: "Code d'accès invalide ou expiré"
  };
}
