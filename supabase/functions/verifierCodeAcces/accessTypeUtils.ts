
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
 */
export function determineAccessType(bruteForceIdentifier?: string): AccessTypeInfo {
  let accessType: 'directives' | 'medical' | 'full' = 'full';
  let isDirectivesOnly = false;
  let isMedicalOnly = false;
  
  if (bruteForceIdentifier) {
    if (bruteForceIdentifier.includes("directives") || bruteForceIdentifier.includes("directives_access")) {
      accessType = "directives";
      isDirectivesOnly = true;
      isMedicalOnly = false;
    } else if (bruteForceIdentifier.includes("medical") || bruteForceIdentifier.includes("medical_access")) {
      accessType = "medical";
      isMedicalOnly = true;
      isDirectivesOnly = false;
    }
  }
  
  return {
    accessType,
    isDirectivesOnly,
    isMedicalOnly
  };
}
