
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

export class PDFSignatureGenerator {
  static async generateSignatureSection(doc: jsPDF, profile: UserProfile, startY: number): Promise<number> {
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
