
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

/**
 * Responsible for generating the signature section and retrieving signature data
 */
export class PDFSignatureGenerator {
  /**
   * Generates the signature section of the PDF document
   * @param doc - The jsPDF document instance
   * @param profile - The user profile containing personal information
   * @param startY - The starting Y position for the signature section
   * @returns The new Y position after adding the signature section
   */
  static async generateSignatureSection(
    doc: jsPDF, 
    profile: UserProfile, 
    startY: number
  ): Promise<number> {
    let yPosition = startY;
    
    // Section signature
    yPosition += 30;
    doc.setFontSize(12);
    
    // Section "Je soussigné(e)" centrée
    doc.text(
      "Je soussigné(e)",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
    
    // Mise à jour du nom complet en utilisant les données du profil
    const fullName = profile ? 
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Non renseigné' : 
      'Non renseigné';
    
    doc.text(
      fullName,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    
    console.log("[PDFGenerator] Generated full name:", fullName);

    yPosition += 15;
    
    // Date et lieu centrés (correction du texte)
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    const location = profile?.city ? `à ${profile.city}` : '';
    doc.text(
      `Fait le ${today} ${location}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    
    return yPosition + 15;
  }

  /**
   * Fetches the user's signature data from the database
   * @param profileId - The ID of the user profile
   * @returns The signature data as a base64 string, or null if not found
   */
  static async fetchSignature(profileId: string): Promise<string | null> {
    console.log("[PDFGenerator] Fetching signature for user:", profileId);
    const { data: signatureData } = await supabase
      .from('user_signatures')
      .select('signature_data')
      .eq('user_id', profileId)
      .maybeSingle();

    return signatureData?.signature_data || null;
  }
}
