
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
    [firstName, lastName] = bruteForceIdentifier.split('_');
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
          input_birthdate: null, // We might not have birthdate 
          input_access_code: accessCode,
        }
      );
      
      if (rpcError) {
        console.error("Error with RPC verification:", rpcError);
      } else if (sharedProfiles && sharedProfiles.length > 0) {
        console.log("RPC verification successful:", sharedProfiles);
        const profile = sharedProfiles[0];
        
        // Get associated documents if any
        const { data: documents, error: docsError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false });
        
        if (docsError) {
          console.error("Error fetching documents:", docsError);
        }
        
        // Determine access type from identifier
        const accessTypeInfo = determineAccessType(bruteForceIdentifier);
        
        // Build dossier object
        const dossier = {
          id: profile.id,
          userId: profile.user_id,
          isFullAccess: true,
          isDirectivesOnly: accessTypeInfo.isDirectivesOnly,
          isMedicalOnly: accessTypeInfo.isMedicalOnly,
          profileData: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            birth_date: profile.birthdate
          },
          contenu: {
            documents: documents || [],
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
          profile.user_id,
          true,
          `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`
        );
        
        console.log("Created dossier from RPC verification:", JSON.stringify(dossier, null, 2));
        
        return {
          success: true,
          dossier
        };
      }
    } catch (rpcError) {
      console.error("Exception during RPC verification:", rpcError);
      // Continue with standard verification if RPC fails
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
    console.log("Found shared profile:", profile);
    
    // Get associated documents if any
    const { data: documents, error: docsError } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false });
    
    if (docsError) {
      console.error("Error fetching documents:", docsError);
    }
    
    // Determine access type from identifier
    const accessTypeInfo = determineAccessType(bruteForceIdentifier);
    
    // Build dossier object
    const dossier = {
      id: profile.id,
      userId: profile.user_id,
      isFullAccess: true,
      isDirectivesOnly: accessTypeInfo.isDirectivesOnly,
      isMedicalOnly: accessTypeInfo.isMedicalOnly,
      profileData: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birthdate
      },
      contenu: {
        documents: documents || [],
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
      profile.user_id,
      true,
      `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`
    );
    
    console.log("Created dossier from shared profile:", JSON.stringify(dossier, null, 2));
    
    return {
      success: true,
      dossier
    };
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
