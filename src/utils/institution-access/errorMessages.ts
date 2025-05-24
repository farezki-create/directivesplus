
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
  if (foundProfiles === 0) {
    return "Aucun profil patient trouvé pour ce code d'accès. " +
           "Le patient doit d'abord créer et compléter son profil sur la plateforme.";
  }

  // Si on a trouvé des profils mais aucune correspondance
  const hasPartialMatches = matchAttempts.some(attempt => 
    attempt.lastNameMatch || attempt.firstNameMatch || attempt.birthDateMatch
  );

  if (hasPartialMatches) {
    return "Les informations saisies ne correspondent pas exactement au profil du patient. " +
           "Vérifiez que :\n" +
           "• Le nom de famille est exactement orthographié comme dans le profil\n" +
           "• Le prénom est exactement orthographié comme dans le profil\n" +
           "• La date de naissance est au format YYYY-MM-DD et correspond exactement";
  }

  return "Aucune correspondance trouvée avec les informations fournies. " +
         "Vérifiez que :\n" +
         "• Le patient a bien créé son profil sur la plateforme\n" +
         "• Le nom de famille est correctement orthographié\n" +
         "• Le prénom est correctement orthographié\n" +
         "• La date de naissance est au format exact (YYYY-MM-DD)\n" +
         "• Les informations correspondent exactement à celles du profil du patient";
};
