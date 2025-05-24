import { determineAccessType } from "./accessTypeUtils.ts";
import { fetchUserProfile } from "./profileService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { StandardResponse } from "./types.ts";

/**
 * Main function to verify access code using different methods
 * @param supabase Supabase client
 * @param accessCode Access code to verify
 * @param bruteForceIdentifier Identifier for brute force protection
 * @param patientName Optional patient name for additional verification
 * @param patientBirthDate Optional patient birthdate for additional verification
 * @returns Standard response with dossier if successful
 */
export async function verifyAccessCode(
  supabase: any,
  accessCode: string,
  bruteForceIdentifier?: string,
  patientName?: string,
  patientBirthDate?: string
): Promise<StandardResponse> {
  // Parse bruteForceIdentifier to get firstName and lastName if available
  let firstName = '', lastName = '';
  if (bruteForceIdentifier && bruteForceIdentifier.includes('_')) {
    const parts = bruteForceIdentifier.split('_');
    if (parts.length >= 3) {
      // Format: "directives_public_FIRSTNAME_LASTNAME"
      firstName = parts[2] || '';
      lastName = parts[3] || '';
    } else if (parts.length >= 2) {
      // Format: "FIRSTNAME_LASTNAME"
      firstName = parts[0] || '';
      lastName = parts[1] || '';
    }
    console.log(`Parsed identifier: firstName=${firstName}, lastName=${lastName}`);
  }

  // First try with RPC function if we have name components
  if (firstName && lastName) {
    try {
      console.log(`Attempting RPC verification with firstName=${firstName}, lastName=${lastName}`);
      
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
        console.log("RPC verification successful:", sharedProfiles);
        const profile = sharedProfiles[0];
        
        // Get the real user_id from the profile
        const realUserId = profile.user_id;
        console.log("Real user ID found:", realUserId);
        
        // Fetch REAL PDF documents from the database
        const { data: pdfDocuments, error: pdfDocsError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', realUserId)
          .order('created_at', { ascending: false });
        
        if (pdfDocsError) {
          console.error("Error fetching PDF documents:", pdfDocsError);
        } else {
          console.log("Real PDF documents found:", pdfDocuments?.length || 0);
        }
        
        // Fetch REAL directives documents from the database - filter out test data
        const { data: directivesDocuments, error: directivesDocsError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', realUserId)
          .order('created_at', { ascending: false });
        
        if (directivesDocsError) {
          console.error("Error fetching directives documents:", directivesDocsError);
        } else {
          console.log("Raw directives documents found:", directivesDocuments?.length || 0);
          
          // Filter out test directives and only keep authentic ones
          const authenticDirectives = directivesDocuments?.filter(doc => {
            const content = doc.content;
            const isTestData = (
              content?.title?.toLowerCase().includes('test') ||
              content?.titre?.toLowerCase().includes('test') ||
              content?.content?.toLowerCase().includes('test') ||
              content?.contenu?.toLowerCase().includes('test') ||
              content?.created_for_institution_access === true
            );
            
            console.log(`Directive ${doc.id}: isTestData=${isTestData}, content:`, content);
            return !isTestData;
          }) || [];
          
          console.log("Authentic directives documents found:", authenticDirectives.length);
          
          // Combine all REAL documents (no test data and no placeholders)
          const allDocuments = [
            ...(pdfDocuments || []).map(doc => ({
              ...doc,
              file_type: doc.content_type || 'application/pdf',
              source: 'pdf_documents'
            })),
            ...authenticDirectives.map(doc => ({
              id: doc.id,
              file_name: doc.content?.title || doc.content?.titre || 'Directive anticipée',
              file_path: doc.id, // Use directive ID as path
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
          
          console.log("Total AUTHENTIC documents found:", allDocuments.length);
          
          // If no documents at all, return empty but valid access
          if (allDocuments.length === 0) {
            console.log("No documents found for user, but access is valid");
          }
          
          // Determine access type from identifier
          const accessTypeInfo = determineAccessType(bruteForceIdentifier);
          
          // Build dossier object with REAL documents only
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
          
          // Log successful access
          await logAccessAttempt(
            supabase,
            realUserId,
            true,
            `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}, Documents authentiques: ${allDocuments.length}`
          );
          
          console.log("Created dossier with REAL documents only:", JSON.stringify(dossier, null, 2));
          
          return {
            success: true,
            dossier
          };
        }
      }
    } catch (rpcError) {
      console.error("Exception during RPC verification:", rpcError);
      // Continue with standard verification if RPC fails
    }
  }

  // Standard verification with shared profiles for real documents
  const { data: sharedProfiles, error: sharedProfileError } = await supabase
    .from('shared_profiles')
    .select('*')
    .eq('access_code', accessCode);

  if (sharedProfileError) {
    console.error("Error fetching shared profile:", sharedProfileError);
  }

  if (sharedProfiles && sharedProfiles.length > 0) {
    const profile = sharedProfiles[0];
    console.log("Found shared profile:", profile);
    
    // Get the real user_id from the profile
    const realUserId = profile.user_id;
    console.log("Real user ID from shared profile:", realUserId);
    
    // Fetch REAL PDF documents from the database
    const { data: pdfDocuments, error: pdfDocsError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', realUserId)
      .order('created_at', { ascending: false });
    
    if (pdfDocsError) {
      console.error("Error fetching PDF documents:", pdfDocsError);
    } else {
      console.log("Real PDF documents found:", pdfDocuments?.length || 0);
    }
    
    // Fetch REAL directives documents from the database - filter out test data
    const { data: directivesDocuments, error: directivesDocsError } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', realUserId)
      .order('created_at', { ascending: false });
    
    if (directivesDocsError) {
      console.error("Error fetching directives documents:", directivesDocsError);
    } else {
      console.log("Raw directives documents found:", directivesDocuments?.length || 0);
      
      // Filter out test directives and only keep authentic ones
      const authenticDirectives = directivesDocuments?.filter(doc => {
        const content = doc.content;
        const isTestData = (
          content?.title?.toLowerCase().includes('test') ||
          content?.titre?.toLowerCase().includes('test') ||
          content?.content?.toLowerCase().includes('test') ||
          content?.contenu?.toLowerCase().includes('test') ||
          content?.created_for_institution_access === true
        );
        
        console.log(`Directive ${doc.id}: isTestData=${isTestData}, content:`, content);
        return !isTestData;
      }) || [];
      
      console.log("Authentic directives documents found:", authenticDirectives.length);
      
      // Combine all REAL documents (no test data and no placeholders)
      const allDocuments = [
        ...(pdfDocuments || []).map(doc => ({
          ...doc,
          file_type: doc.content_type || 'application/pdf',
          source: 'pdf_documents'
        })),
        ...authenticDirectives.map(doc => ({
          id: doc.id,
          file_name: doc.content?.title || doc.content?.titre || 'Directive anticipée',
          file_path: doc.id, // Use directive ID as path
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
      
      console.log("Total AUTHENTIC documents found:", allDocuments.length);
      
      // If no documents at all, return empty but valid access
      if (allDocuments.length === 0) {
        console.log("No documents found for user, but access is valid");
      }
      
      // Determine access type from identifier
      const accessTypeInfo = determineAccessType(bruteForceIdentifier);
      
      // Build dossier object with REAL documents only
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
      
      // Log successful access
      await logAccessAttempt(
        supabase,
        realUserId,
        true,
        `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}, Documents authentiques: ${allDocuments.length}`
      );
      
      console.log("Created dossier with REAL documents only:", JSON.stringify(dossier, null, 2));
      
      return {
        success: true,
        dossier
      };
    }
  }

  // If no shared profile found, try with medical dossiers
  const { data: dossierMedical, error: dossierError } = await supabase
    .from('dossiers_medicaux')
    .select('*')
    .eq('code_acces', accessCode);
    
  if (dossierError) {
    console.error("Error fetching dossier:", dossierError);
  }

  if (dossierMedical && dossierMedical.length > 0) {
    const dossier = dossierMedical[0];
    console.log("Found medical dossier with code:", accessCode);
    
    // Log access
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

  // No valid dossier found with the provided code
  console.log("No valid dossier found with code:", accessCode);
  
  return {
    success: false,
    error: "Code d'accès invalide ou expiré"
  };
}
