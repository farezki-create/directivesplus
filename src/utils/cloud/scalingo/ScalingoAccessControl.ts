
import { UserVerification } from './types';

export class ScalingoAccessControl {
  /**
   * Generates a unique access identifier for the document
   */
  static generateAccessId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Verifies user access to a document
   */
  static async verifyAccess(accessId: string, userInfo: UserVerification): Promise<string | null> {
    try {
      console.log(`[ScalingoAccessControl] Verifying access with ID: ${accessId}`);
      console.log(`[ScalingoAccessControl] User info:`, userInfo);
      
      // Handle both formats: with or without prefixes
      // Also trim any whitespace to avoid issues with copied codes
      let normalizedAccessId = accessId.trim();
      if (normalizedAccessId.startsWith('DA-') || normalizedAccessId.startsWith('DM-')) {
        normalizedAccessId = normalizedAccessId.substring(3);
      }
      
      // Simulate verification with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return document ID for the access verification
      // The document ID format matches what would be expected by the system
      return `document_${normalizedAccessId}`;
    } catch (error) {
      console.error("[ScalingoAccessControl] Access verification error:", error);
      return null;
    }
  }
}
