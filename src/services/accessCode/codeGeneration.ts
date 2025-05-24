
/**
 * Service pour la génération des codes d'accès
 */
export class CodeGenerationService {
  /**
   * Génère un code fixe basé sur l'ID utilisateur (toujours le même)
   */
  static generateFixedCode(userId: string): string {
    const baseCode = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
    const paddedCode = baseCode.padEnd(8, '0');
    
    return paddedCode
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S')
      .substring(0, 8);
  }
}
