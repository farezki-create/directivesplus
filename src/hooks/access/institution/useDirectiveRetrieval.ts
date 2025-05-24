import { validateInstitutionCodes, validateProfileMatches } from "@/utils/institution-access/profileValidator";
import { retrieveUserDocuments } from "@/utils/institution-access/documentRetrieval";
import { generateErrorMessage } from "@/utils/institution-access/errorMessages";
import { runInstitutionAccessDiagnostics } from "@/utils/institution-access/diagnostics";

interface CleanedValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface OriginalValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface DirectiveRecord {
  id: string;
  user_id: string;
  content: {
    documents: DirectiveDocument[];
  };
  created_at: string;
}

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("=== STARTING DIRECTIVE RETRIEVAL ===");
  console.log("Cleaned values:", cleanedValues);
  console.log("Original values:", originalValues);
  
  try {
    // Exécuter les diagnostics en premier
    await runInstitutionAccessDiagnostics(cleanedValues.institutionCode);

    // Vérifier les codes d'institution valides
    const allValidCodes = await validateInstitutionCodes(cleanedValues.institutionCode);
    console.log(`Found ${allValidCodes.length} valid institution codes`);

    // Valider les correspondances de profils
    const { matchAttempts, foundProfiles } = await validateProfileMatches(allValidCodes, cleanedValues);
    console.log("Match attempts completed:", { matchAttempts, foundProfiles });

    // Chercher une correspondance parfaite
    const perfectMatch = matchAttempts.find(attempt => attempt.allMatch);
    
    if (perfectMatch) {
      console.log("=== PERFECT MATCH FOUND! ===");
      console.log("Perfect match details:", perfectMatch);
      
      const directiveId = allValidCodes.find(code => code.user_id === perfectMatch.user_id)?.id;
      if (directiveId) {
        console.log("Retrieving documents for directive ID:", directiveId);
        const directiveRecord = await retrieveUserDocuments(perfectMatch.user_id, directiveId);
        console.log("Documents retrieved successfully:", directiveRecord);
        return [directiveRecord];
      } else {
        console.error("No directive ID found for perfect match user");
        throw new Error("Erreur: directive non trouvée pour cet utilisateur");
      }
    }

    // Si aucune correspondance parfaite, analyser les correspondances partielles
    const nameMatches = matchAttempts.filter(attempt => 
      attempt.lastNameMatch && attempt.firstNameMatch
    );
    
    if (nameMatches.length > 0) {
      console.log("=== NAME MATCHES FOUND BUT DATE MISMATCH ===");
      console.log("Name matches:", nameMatches);
      
      const mismatchDetails = nameMatches.map(match => ({
        user_id: match.user_id,
        input_date: cleanedValues.birthDate,
        profile_date: match.profile.birth_date,
        profile_name: `${match.profile.first_name} ${match.profile.last_name}`
      }));
      
      console.log("Date mismatch details:", mismatchDetails);
      
      throw new Error(
        "Les informations ne correspondent pas exactement au profil du patient. " +
        `Nom et prénom correspondent, mais la date de naissance saisie (${cleanedValues.birthDate}) ` +
        `ne correspond pas à celle du profil. Veuillez vérifier la date de naissance.`
      );
    }

    // Analyser les correspondances partielles par champ
    const partialMatches = {
      lastNameOnly: matchAttempts.filter(m => m.lastNameMatch && !m.firstNameMatch),
      firstNameOnly: matchAttempts.filter(m => !m.lastNameMatch && m.firstNameMatch),
      birthDateOnly: matchAttempts.filter(m => !m.lastNameMatch && !m.firstNameMatch && m.birthDateMatch)
    };

    console.log("=== PARTIAL MATCHES ANALYSIS ===");
    console.log("Last name only matches:", partialMatches.lastNameOnly.length);
    console.log("First name only matches:", partialMatches.firstNameOnly.length);
    console.log("Birth date only matches:", partialMatches.birthDateOnly.length);

    console.log("=== FINAL ANALYSIS ===");
    console.log("Total valid codes:", allValidCodes.length);
    console.log("Profiles found:", foundProfiles);
    console.log("Perfect matches:", matchAttempts.filter(m => m.allMatch).length);
    console.log("Name matches:", nameMatches.length);
    console.log("No matches found - generating error message");

    // Générer le message d'erreur approprié
    const errorMessage = generateErrorMessage(foundProfiles, matchAttempts);
    throw new Error(errorMessage);
  } catch (error) {
    console.error("Error in retrieveDirectivesByInstitutionCode:", error);
    throw error;
  }
};
