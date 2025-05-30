
interface ValidationResult {
  isValid: boolean;
  type?: 'rpps' | 'adeli' | 'finess';
  formattedNumber?: string;
  error?: string;
}

export const validateProfessionalId = (id: string): ValidationResult => {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'Numéro professionnel requis' };
  }

  // Remove all non-digit characters
  const cleanId = id.replace(/\D/g, '');

  if (cleanId.length < 8 || cleanId.length > 11) {
    return { isValid: false, error: 'Le numéro professionnel doit contenir entre 8 et 11 chiffres' };
  }

  // RPPS (Répertoire Partagé des Professionnels de Santé) - 11 digits
  if (cleanId.length === 11) {
    if (validateRPPS(cleanId)) {
      return { 
        isValid: true, 
        type: 'rpps', 
        formattedNumber: formatRPPS(cleanId)
      };
    }
  }

  // ADELI (Automatisation DEs LIstes) - 9 digits
  if (cleanId.length === 9) {
    if (validateADELI(cleanId)) {
      return { 
        isValid: true, 
        type: 'adeli', 
        formattedNumber: formatADELI(cleanId)
      };
    }
  }

  // FINESS (Fichier National des Établissements Sanitaires et Sociaux) - 8 or 9 digits
  if (cleanId.length === 8 || cleanId.length === 9) {
    if (validateFINESS(cleanId)) {
      return { 
        isValid: true, 
        type: 'finess', 
        formattedNumber: cleanId
      };
    }
  }

  return { isValid: false, error: 'Numéro professionnel invalide' };
};

const validateRPPS = (rpps: string): boolean => {
  if (rpps.length !== 11) return false;
  
  // RPPS uses Luhn algorithm for validation
  return validateLuhn(rpps);
};

const validateADELI = (adeli: string): boolean => {
  if (adeli.length !== 9) return false;
  
  // Basic format validation for ADELI
  // First 2 digits represent department (01-95)
  const dept = parseInt(adeli.substring(0, 2), 10);
  return dept >= 1 && dept <= 95;
};

const validateFINESS = (finess: string): boolean => {
  if (finess.length < 8 || finess.length > 9) return false;
  
  // Basic validation - all digits
  return /^\d+$/.test(finess);
};

const validateLuhn = (number: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  // Loop through digits from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

const formatRPPS = (rpps: string): string => {
  // Format: XX XXX XXX XXX
  return rpps.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
};

const formatADELI = (adeli: string): string => {
  // Format: XX XXX XXXX
  return adeli.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
};
