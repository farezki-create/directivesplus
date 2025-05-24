
import { validateInstitutionCodes, validateProfileMatches } from "@/utils/institution-access/profileValidator";
import { retrieveUserDocuments } from "@/utils/institution-access/documentRetrieval";
import { generateErrorMessage } from "@/utils/institution-access/errorMessages";

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
  console.log("=== Starting directive retrieval ===");
  console.log("Cleaned values:", cleanedValues);
  console.log("Original values:", originalValues);
  
  // Vérifier les codes d'institution valides
  const allValidCodes = await validateInstitutionCodes(cleanedValues.institutionCode);
  console.log(`Found ${allValidCodes.length} valid institution codes`);

  // Valider les correspondances de profils
  const { matchAttempts, foundProfiles } = await validateProfileMatches(allValidCodes, cleanedValues);

  // Chercher une correspondance parfaite
  const perfectMatch = matchAttempts.find(attempt => attempt.allMatch);
  
  if (perfectMatch) {
    const directiveId = allValidCodes.find(code => code.user_id === perfectMatch.user_id)?.id;
    if (directiveId) {
      const directiveRecord = await retrieveUserDocuments(perfectMatch.user_id, directiveId);
      return [directiveRecord];
    }
  }

  console.log("=== FINAL ANALYSIS ===");
  console.log("Total valid codes:", allValidCodes.length);
  console.log("Profiles found:", foundProfiles);
  console.log("Match attempts:", matchAttempts);

  // Générer le message d'erreur approprié
  const errorMessage = generateErrorMessage(foundProfiles, matchAttempts);
  throw new Error(errorMessage);
};
