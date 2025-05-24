
interface ProfileMatchResult {
  user_id: string;
  profile: any;
  lastNameMatch: boolean;
  firstNameMatch: boolean;
  birthDateMatch: boolean;
  allMatch: boolean;
}

export const generateErrorMessage = (
  foundProfiles: number,
  matchAttempts: ProfileMatchResult[]
): string => {
  console.log("=== GENERATING ERROR MESSAGE ===");
  console.log("Found profiles:", foundProfiles);
  console.log("Match attempts:", matchAttempts);

  if (foundProfiles === 0) {
    return "Aucun profil patient trouvé pour ce code d'accès. " +
           "Le patient doit d'abord créer et compléter son profil sur la plateforme.";
  }

  // Analyser les types de correspondances partielles
  const analysis = {
    lastNameMatches: matchAttempts.filter(m => m.lastNameMatch).length,
    firstNameMatches: matchAttempts.filter(m => m.firstNameMatch).length,
    birthDateMatches: matchAttempts.filter(m => m.birthDateMatch).length,
    nameOnlyMatches: matchAttempts.filter(m => m.lastNameMatch && m.firstNameMatch && !m.birthDateMatch).length
  };

  console.log("Match analysis:", analysis);

  // Si on a des correspondances de noms mais pas de date
  if (analysis.nameOnlyMatches > 0) {
    const example = matchAttempts.find(m => m.lastNameMatch && m.firstNameMatch && !m.birthDateMatch);
    return "Les nom et prénom correspondent, mais la date de naissance ne correspond pas. " +
           `Date saisie: ${example?.profile.birth_date ? 'vérifiez votre saisie' : 'non renseignée dans le profil'}. ` +
           "Vérifiez que la date de naissance est au format YYYY-MM-DD et correspond exactement.";
  }

  // Si on a des correspondances partielles
  if (analysis.lastNameMatches > 0 || analysis.firstNameMatches > 0 || analysis.birthDateMatches > 0) {
    let details = "Correspondances partielles trouvées :\n";
    if (analysis.lastNameMatches > 0) details += "• Nom de famille correspond\n";
    if (analysis.firstNameMatches > 0) details += "• Prénom correspond\n";
    if (analysis.birthDateMatches > 0) details += "• Date de naissance correspond\n";
    
    return "Les informations saisies ne correspondent pas exactement au profil du patient.\n" +
           details +
           "Vérifiez que tous les champs sont correctement orthographiés et correspondent exactement au profil.";
  }

  // Aucune correspondance du tout
  return "Aucune correspondance trouvée avec les informations fournies. " +
         "Vérifiez que :\n" +
         "• Le patient a bien créé son profil sur la plateforme\n" +
         "• Le nom de famille est correctement orthographié\n" +
         "• Le prénom est correctement orthographié\n" +
         "• La date de naissance est au format exact (YYYY-MM-DD)\n" +
         "• Les informations correspondent exactement à celles du profil du patient";
};
