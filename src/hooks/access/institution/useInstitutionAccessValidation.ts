
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
  }

  if (!values.firstName || values.firstName.trim() === '') {
    errors.firstName = "Le prénom est obligatoire";
  }

  if (!values.birthDate) {
    errors.birthDate = "La date de naissance est obligatoire";
  } else if (!DATE_REGEX.test(values.birthDate)) {
    errors.birthDate = "Format de date invalide. Utilisez le format YYYY-MM-DD";
  }

  if (!values.institutionCode || values.institutionCode.trim() === '') {
    errors.institutionCode = "Le code d'accès institution est obligatoire";
  } else if (values.institutionCode.length < 6) {
    errors.institutionCode = "Le code d'accès institution doit contenir au moins 6 caractères";
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
