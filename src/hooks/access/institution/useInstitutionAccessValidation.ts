
export const validateInstitutionAccessForm = (values: {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!values.lastName.trim()) {
    errors.lastName = "Le nom du patient est requis";
  }
  
  if (!values.firstName.trim()) {
    errors.firstName = "Le prénom du patient est requis";
  }
  
  if (!values.birthDate) {
    errors.birthDate = "La date de naissance est requise";
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(values.birthDate)) {
      errors.birthDate = "Format de date invalide";
    } else {
      const birthDate = new Date(values.birthDate);
      const today = new Date();
      if (birthDate > today) {
        errors.birthDate = "La date de naissance ne peut pas être dans le futur";
      }
    }
  }
  
  if (!values.institutionCode.trim()) {
    errors.institutionCode = "Le code d'accès institution est requis";
  } else if (values.institutionCode.trim().length < 6) {
    errors.institutionCode = "Le code d'accès doit contenir au moins 6 caractères";
  }
  
  return errors;
};

export const cleanInstitutionAccessValues = (values: {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}) => ({
  lastName: values.lastName.trim().toUpperCase(),
  firstName: values.firstName.trim().toUpperCase(),
  birthDate: values.birthDate.trim(),
  institutionCode: values.institutionCode.trim().toUpperCase()
});

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
