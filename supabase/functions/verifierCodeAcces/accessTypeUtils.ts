
/**
 * Utilities for determining access types based on context identifiers
 */

export type AccessTypeInfo = {
  accessType: 'directives' | 'medical' | 'full';
  isDirectivesOnly: boolean;
  isMedicalOnly: boolean;
};

/**
 * Determine access type based on bruteForceIdentifier
 * @param bruteForceIdentifier Identifier for access context
 * @returns Access type information object
 */
export function determineAccessType(bruteForceIdentifier?: string): AccessTypeInfo {
  // Default to full access
  let accessType: 'directives' | 'medical' | 'full' = 'full';
  let isDirectivesOnly = false;
  let isMedicalOnly = false;
  
  if (bruteForceIdentifier) {
    if (bruteForceIdentifier.includes("directives_access")) {
      accessType = "directives";
      isDirectivesOnly = true;
      isMedicalOnly = false;
      console.log("Type d'accès défini: directives uniquement");
    } else if (bruteForceIdentifier.includes("medical_access")) {
      accessType = "medical";
      isMedicalOnly = true;
      isDirectivesOnly = false;
      console.log("Type d'accès défini: médical uniquement");
    } else {
      console.log("Type d'accès défini: complet (par défaut)");
    }
  }
  
  console.log(`Type d'accès déterminé: ${accessType}, DirectivesOnly: ${isDirectivesOnly}, MedicalOnly: ${isMedicalOnly}`);
  
  return {
    accessType,
    isDirectivesOnly,
    isMedicalOnly
  };
}
