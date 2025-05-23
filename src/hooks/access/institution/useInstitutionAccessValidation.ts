
// Validation pour les accès institution

// Format YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export interface InstitutionAccessFormErrors {
  lastName?: string;
  firstName?: string;
  birthDate?: string;
  institutionCode?: string;
}

export const validateInstitutionAccessForm = (values: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.lastName || values.lastName.trim() === '') {
    errors.lastName = "Le nom de famille est obligatoire";
  } else if (values.lastName.trim().length < 2) {
    errors.lastName = "Le nom de famille doit contenir au moins 2 caractères";
  }

  if (!values.firstName || values.firstName.trim() === '') {
    errors.firstName = "Le prénom est obligatoire";
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = "Le prénom doit contenir au moins 2 caractères";
  }

  if (!values.birthDate) {
    errors.birthDate = "La date de naissance est obligatoire";
  } else if (!DATE_REGEX.test(values.birthDate)) {
    errors.birthDate = "Format de date invalide. Utilisez le format YYYY-MM-DD";
  } else {
    // Vérifier que la date est dans le passé
    const birthDate = new Date(values.birthDate);
    const today = new Date();
    if (birthDate >= today) {
      errors.birthDate = "La date de naissance doit être dans le passé";
    }
    
    // Vérifier que la date n'est pas trop ancienne (plus de 150 ans)
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 150);
    if (birthDate < minDate) {
      errors.birthDate = "Date de naissance non valide";
    }
  }

  if (!values.institutionCode || values.institutionCode.trim() === '') {
    errors.institutionCode = "Le code d'accès institution est obligatoire";
  } else if (values.institutionCode.trim().length < 6) {
    errors.institutionCode = "Le code d'accès institution doit contenir au moins 6 caractères";
  } else if (values.institutionCode.trim().length > 20) {
    errors.institutionCode = "Le code d'accès institution ne peut pas dépasser 20 caractères";
  }

  return errors;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const cleanInstitutionAccessValues = (values: any) => {
  return {
    lastName: values.lastName.trim().toUpperCase(),
    firstName: capitalizeFirstLetter(values.firstName.trim()),
    birthDate: values.birthDate,
    institutionCode: values.institutionCode.trim().toUpperCase()
  };
};
