
// Validation des numéros d'identification professionnels français

export type ProfessionalIdType = 'RPPS' | 'ADELI' | 'FINESS';

export interface ProfessionalIdValidationResult {
  isValid: boolean;
  type: ProfessionalIdType | null;
  formattedNumber: string;
  error?: string;
}

/**
 * Valide un numéro RPPS (Répertoire Partagé des Professionnels de Santé)
 * Format: 11 chiffres
 */
export const validateRPPS = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{11}$/.test(cleaned);
};

/**
 * Valide un numéro ADELI (Automatisation DEs LIstes)
 * Format: 9 chiffres
 */
export const validateADELI = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{9}$/.test(cleaned);
};

/**
 * Valide un numéro FINESS (Fichier National des Établissements Sanitaires et Sociaux)
 * Format: 9 chiffres
 */
export const validateFINESS = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{9}$/.test(cleaned);
};

/**
 * Détecte automatiquement le type de numéro et le valide
 */
export const validateProfessionalId = (number: string): ProfessionalIdValidationResult => {
  if (!number || number.trim() === '') {
    return {
      isValid: false,
      type: null,
      formattedNumber: '',
      error: 'Numéro d\'identification obligatoire'
    };
  }

  const cleaned = number.replace(/\s/g, '');
  
  // RPPS: 11 chiffres
  if (cleaned.length === 11 && validateRPPS(cleaned)) {
    return {
      isValid: true,
      type: 'RPPS',
      formattedNumber: cleaned
    };
  }
  
  // ADELI: 9 chiffres
  if (cleaned.length === 9 && validateADELI(cleaned)) {
    return {
      isValid: true,
      type: 'ADELI',
      formattedNumber: cleaned
    };
  }
  
  // FINESS: 9 chiffres (mais différent d'ADELI par le contexte)
  if (cleaned.length === 9 && validateFINESS(cleaned)) {
    return {
      isValid: true,
      type: 'FINESS',
      formattedNumber: cleaned
    };
  }
  
  return {
    isValid: false,
    type: null,
    formattedNumber: cleaned,
    error: 'Format invalide. Attendu: RPPS (11 chiffres), ADELI ou FINESS (9 chiffres)'
  };
};

/**
 * Formate un numéro pour l'affichage
 */
export const formatProfessionalId = (number: string, type: ProfessionalIdType): string => {
  const cleaned = number.replace(/\s/g, '');
  
  switch (type) {
    case 'RPPS':
      // Format: XXX XXX XXX XX
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4');
    case 'ADELI':
    case 'FINESS':
      // Format: XXX XXX XXX
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    default:
      return cleaned;
  }
};
