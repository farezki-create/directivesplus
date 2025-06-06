
export interface ProfessionalIdValidationResult {
  isValid: boolean;
  type?: 'rpps' | 'adeli' | 'finess' | null;
  formattedNumber?: string;
  error?: string;
}

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

  // Remove all non-digit characters and convert to uppercase for alphanumeric codes
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

export const formatProfessionalId = (id: string, type?: 'rpps' | 'adeli' | 'finess' | null): string => {
  if (!type) return id;
  
  switch (type) {
    case 'rpps':
      return formatRPPS(id);
    case 'adeli':
      return formatADELI(id);
    case 'finess':
      return id;
    default:
      return id;
  }
};

const validateRPPS = (rpps: string): boolean => {
  if (rpps.length !== 11) return false;
  
  // RPPS uses Luhn algorithm for validation
  return validateLuhn(rpps);
};

const validateADELI = (adeli: string): boolean => {
  if (adeli.length !== 9) return false;
  
  // Enhanced ADELI validation
  // First 2 digits represent department (01-95, plus overseas departments)
  const dept = parseInt(adeli.substring(0, 2), 10);
  
  // Valid department codes (metropolitan France + overseas)
  const validDepts = dept >= 1 && dept <= 95 || 
                    dept === 97 || dept === 98; // Overseas territories
  
  if (!validDepts) return false;
  
  // Professional code (3rd digit) should be valid (1-9)
  const profCode = parseInt(adeli.substring(2, 3), 10);
  if (profCode < 1 || profCode > 9) return false;
  
  // Serial number should be numeric
  const serialNumber = adeli.substring(3, 8);
  if (!/^\d{5}$/.test(serialNumber)) return false;
  
  // Check digit validation (simple modulo 97)
  const checkDigit = parseInt(adeli.substring(8, 9), 10);
  const baseNumber = parseInt(adeli.substring(0, 8), 10);
  const calculatedCheck = 97 - (baseNumber % 97);
  
  return checkDigit === calculatedCheck;
};

const validateFINESS = (finess: string): boolean => {
  if (finess.length < 8 || finess.length > 9) return false;
  
  // Enhanced FINESS validation
  // All digits must be numeric
  if (!/^\d+$/.test(finess)) return false;
  
  // FINESS geographical code validation (first 2 digits)
  const geoCode = parseInt(finess.substring(0, 2), 10);
  const validGeoCodes = (geoCode >= 1 && geoCode <= 95) || 
                       geoCode === 97 || geoCode === 98;
  
  if (!validGeoCodes) return false;
  
  // Category code validation (3rd digit)
  const categoryCode = parseInt(finess.substring(2, 3), 10);
  if (categoryCode < 0 || categoryCode > 9) return false;
  
  return true;
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
