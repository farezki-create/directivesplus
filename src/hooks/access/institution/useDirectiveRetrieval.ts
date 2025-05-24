
import { validateInstitutionCodes } from "@/utils/institution-access/profileValidator";
import { findMatchingProfiles } from "@/utils/institution-access/profileMatcher";
import { retrieveUserDocuments } from "@/utils/institution-access/documentRetrieval";
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

const generateDetailedErrorMessage = (
  foundProfiles: number,
  matches: any[],
  cleanedValues: CleanedValues
): string => {
  console.log("=== GÉNÉRATION MESSAGE D'ERREUR ===");
  console.log("Profils trouvés:", foundProfiles);
  console.log("Correspondances:", matches.length);
  
  if (foundProfiles === 0) {
    return "Aucun profil patient trouvé dans la base de données pour ce code d'accès. " +
           "Vérifiez que le patient a bien créé son compte et complété son profil sur la plateforme.";
  }
  
  const perfectMatches = matches.filter(m => m.allMatch);
  if (perfectMatches.length > 0) {
    return "Correspondance trouvée mais erreur inattendue. Contactez le support technique.";
  }
  
  const nameMatches = matches.filter(m => m.lastNameMatch && m.firstNameMatch);
  if (nameMatches.length > 0) {
    const example = nameMatches[0];
    return `Les nom et prénom correspondent au profil du patient, mais la date de naissance ne correspond pas.\n` +
           `Date saisie: ${cleanedValues.birthDate}\n` +
           `Date dans le profil: ${example.profile.birth_date || 'non renseignée'}\n` +
           `Vérifiez que la date de naissance est correcte et au format YYYY-MM-DD.`;
  }
  
  const partialMatches = {
    lastName: matches.filter(m => m.lastNameMatch && !m.firstNameMatch).length,
    firstName: matches.filter(m => !m.lastNameMatch && m.firstNameMatch).length,
    birthDate: matches.filter(m => !m.lastNameMatch && !m.firstNameMatch && m.birthDateMatch).length
  };
  
  if (partialMatches.lastName > 0 || partialMatches.firstName > 0 || partialMatches.birthDate > 0) {
    let message = "Correspondances partielles trouvées mais aucune correspondance complète:\n";
    if (partialMatches.lastName > 0) message += `• ${partialMatches.lastName} correspondance(s) de nom de famille\n`;
    if (partialMatches.firstName > 0) message += `• ${partialMatches.firstName} correspondance(s) de prénom\n`;
    if (partialMatches.birthDate > 0) message += `• ${partialMatches.birthDate} correspondance(s) de date de naissance\n`;
    message += "\nVérifiez l'orthographe exacte de tous les champs.";
    return message;
  }
  
  return "Aucune correspondance trouvée avec les informations fournies.\n" +
         "Vérifiez que:\n" +
         "• Le nom de famille est correctement orthographié\n" +
         "• Le prénom est correctement orthographié\n" +
         "• La date de naissance est au format YYYY-MM-DD\n" +
         "• Le patient a bien créé et complété son profil sur la plateforme";
};

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("=== DÉBUT RÉCUPÉRATION DIRECTIVES ===");
  console.log("Valeurs nettoyées:", cleanedValues);
  console.log("Valeurs originales:", originalValues);
  
  try {
    // Diagnostics préliminaires
    await runInstitutionAccessDiagnostics(cleanedValues.institutionCode);

    // Validation des codes d'institution
    const validCodes = await validateInstitutionCodes(cleanedValues.institutionCode);
    console.log(`Codes d'institution valides trouvés: ${validCodes.length}`);

    if (validCodes.length === 0) {
      throw new Error("Code d'accès institution invalide ou expiré.");
    }

    // Recherche des profils correspondants avec la nouvelle logique
    const { matches, foundProfiles } = await findMatchingProfiles(validCodes, cleanedValues);

    // Vérification des correspondances parfaites
    const perfectMatch = matches.find(match => match.allMatch);
    
    if (perfectMatch) {
      console.log("=== CORRESPONDANCE PARFAITE TROUVÉE! ===");
      console.log("Détails correspondance:", perfectMatch);
      
      const directiveId = validCodes.find(code => code.user_id === perfectMatch.user_id)?.id;
      if (directiveId) {
        console.log("Récupération documents pour directive ID:", directiveId);
        const directiveRecord = await retrieveUserDocuments(perfectMatch.user_id, directiveId);
        console.log("Documents récupérés avec succès:", directiveRecord);
        return [directiveRecord];
      } else {
        console.error("Aucun ID de directive trouvé pour la correspondance parfaite");
        throw new Error("Erreur: directive non trouvée pour cet utilisateur");
      }
    }

    // Aucune correspondance parfaite trouvée
    console.log("=== AUCUNE CORRESPONDANCE PARFAITE ===");
    const errorMessage = generateDetailedErrorMessage(foundProfiles, matches, cleanedValues);
    throw new Error(errorMessage);
    
  } catch (error) {
    console.error("Erreur dans retrieveDirectivesByInstitutionCode:", error);
    throw error;
  }
};
