
import { PDFCardGenerator } from "@/components/pdf/utils/PDFCardGenerator";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { supabase } from "@/integrations/supabase/client";
import { generateAccessCodes } from "./utils/accessCodeGenerator";
import { saveCardToStorage } from "./utils/cardStorage";

export class CardGenerationService {
  static async generateCard(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    try {
      console.log("[CardGenerationService] Starting card generation");
      
      // Generate PDF
      const cardUrl = await PDFCardGenerator.generate(profile, trustedPersons);
      
      if (!cardUrl) {
        throw new Error("Card generation failed");
      }

      return cardUrl;
    } catch (error) {
      console.error("[CardGenerationService] Error generating card:", error);
      throw error;
    }
  }
}
