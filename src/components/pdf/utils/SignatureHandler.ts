
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

export class SignatureHandler {
  /**
   * Fetches the user's signature from the database and applies it to the document
   */
  static async applySignature(doc: jsPDF, profile: UserProfile): Promise<void> {
    if (!profile.id) {
      console.warn("[SignatureHandler] No profile ID provided, cannot fetch signature");
      return;
    }

    console.log("[SignatureHandler] Fetching signature for user:", profile.id);
    const { data: signatureData } = await supabase
      .from('user_signatures')
      .select('signature_data')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (!signatureData?.signature_data) {
      console.warn("[SignatureHandler] No signature found for user:", profile.id);
      return;
    }

    // Get dimensions for positioning
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = {
      bottom: 30,
      left: 20
    };

    // Add large signature at the end of the document (on the current page)
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    const totalPages = doc.internal.getNumberOfPages();
    const yPosition = currentPage === totalPages ? 
      pageHeight - 80 : 
      pageHeight - 80;
    
    const largeSignatureWidth = 80;
    const largeSignatureHeight = 40;
    
    doc.addImage(
      signatureData.signature_data,
      'PNG',
      (pageWidth - largeSignatureWidth) / 2,
      yPosition,
      largeSignatureWidth,
      largeSignatureHeight
    );
    
    doc.setFontSize(10);
    doc.text(
      `Signature de ${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      doc.internal.pageSize.getWidth() / 2,
      yPosition + largeSignatureHeight + 10,
      { align: "center" }
    );
    
    // Add small signature at bottom of each page
    const signatureHeight = 15;
    const signatureWidth = 30;
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Add the signature in bottom left
      doc.addImage(
        signatureData.signature_data,
        'PNG',
        margin.left,
        pageHeight - margin.bottom,
        signatureWidth,
        signatureHeight
      );

      // Add text next to the signature
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(
        `Signé par ${profile.first_name || ''} ${profile.last_name || ''}`.trim() + 
        ` le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`,
        margin.left + signatureWidth + 5,
        pageHeight - margin.bottom + signatureHeight/2
      );
    }
  }
}
