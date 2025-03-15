import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { supabase } from "@/integrations/supabase/client";

export const handlePDFGeneration = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation");
    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", profile);
    console.log("[PDFGeneration] Responses data:", responses);

    // Generate PDF with fallback mechanisms
    let pdfDataUrl = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!pdfDataUrl && attempts < maxAttempts) {
      attempts++;
      console.log(`[PDFGeneration] Attempt ${attempts} of ${maxAttempts}`);
      
      try {
        if (attempts === 1) {
          // Try with the standard generator first
          pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
        } else if (attempts === 2) {
          // Try with simpler content if first attempt failed
          pdfDataUrl = await generateSimplifiedPDF(profile, responses, trustedPersons);
        } else {
          // Last attempt - generate extremely basic PDF
          pdfDataUrl = await generateBasicPDF(profile);
        }
      } catch (genError) {
        console.error(`[PDFGeneration] Error in attempt ${attempts}:`, genError);
        // Continue to next attempt
      }
      
      if (pdfDataUrl) {
        console.log(`[PDFGeneration] Successfully generated PDF on attempt ${attempts}`);
        break;
      }
      
      // Small delay before next attempt
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] All PDF generation attempts failed");
      throw new Error("La génération du PDF a échoué après plusieurs tentatives");
    }

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
      try {
        console.log("[PDFGeneration] Saving PDF to storage for user:", profile.unique_identifier);
        await savePDFToStorage(pdfDataUrl, profile.unique_identifier);
      } catch (storageError) {
        console.error("[PDFGeneration] Error saving PDF to storage:", storageError);
        // Continue with preview even if storage fails
      }
    }

    setPdfUrl(pdfDataUrl);
    setShowPreview(true);

    console.log("[PDFGeneration] PDF generated successfully");
    toast({
      title: "Succès",
      description: "Le PDF a été généré avec succès.",
    });
  } catch (error) {
    console.error("[PDFGeneration] Error generating PDF:", error);
    
    // Try in-browser printing as fallback if PDF generation fails completely
    try {
      console.log("[PDFGeneration] Attempting in-browser printing fallback");
      const printWindow = openPrintWindow(profile, responses);
      
      if (printWindow) {
        setPdfUrl(null);
        toast({
          title: "Alternative",
          description: "Une fenêtre d'impression a été ouverte pour les directives.",
        });
        return;
      }
    } catch (printError) {
      console.error("[PDFGeneration] Print fallback also failed:", printError);
    }
    
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
  }
};

// Simplified PDF generation with minimal content
const generateSimplifiedPDF = async (profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) => {
  console.log("[PDFGeneration] Trying simplified PDF generation");
  const { jsPDF } = await import("jspdf");
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Add minimal content
  doc.setFontSize(18);
  doc.text("Directives Anticipées", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(`${profile.first_name} ${profile.last_name}`, 105, 40, { align: "center" });
  
  doc.setFontSize(12);
  if (responses.synthesis?.free_text) {
    doc.text("Mes directives:", 20, 60);
    const lines = doc.splitTextToSize(responses.synthesis.free_text, 170);
    doc.text(lines, 20, 70);
  }
  
  return doc.output('dataurlstring');
};

// Extremely basic PDF with just user info
const generateBasicPDF = async (profile: UserProfile) => {
  console.log("[PDFGeneration] Trying basic PDF generation");
  const { jsPDF } = await import("jspdf");
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Just add the essentials
  doc.setFontSize(18);
  doc.text("Directives Anticipées", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(`${profile.first_name} ${profile.last_name}`, 105, 40, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Ce document n'a pas pu être généré complètement.", 20, 60);
  doc.text("Veuillez contacter le support technique.", 20, 70);
  
  return doc.output('dataurlstring');
};

// Open a print window with formatted content as fallback
const openPrintWindow = (profile: UserProfile | null, responses: any) => {
  if (!profile) return null;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return null;
  
  let content = `
    <html>
      <head>
        <title>Directives Anticipées - ${profile.first_name} ${profile.last_name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; font-size: 16px; }
          .content { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Directives Anticipées</h1>
        <div class="section">
          <div class="section-title">Identité:</div>
          <div class="content">
            ${profile.first_name} ${profile.last_name}<br/>
            ${profile.birth_date ? `Né(e) le: ${profile.birth_date}<br/>` : ''}
            ${profile.email ? `Email: ${profile.email}<br/>` : ''}
          </div>
        </div>
  `;
  
  // Add synthesis if available
  if (responses.synthesis?.free_text) {
    content += `
      <div class="section">
        <div class="section-title">Mes directives:</div>
        <div class="content">
          ${responses.synthesis.free_text.replace(/\n/g, '<br/>')}
        </div>
      </div>
    `;
  }
  
  content += `
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
  
  return printWindow;
};

export const savePDFToStorage = async (pdfDataUrl: string, userId: string) => {
  try {
    // Convert data URL to Blob
    const response = await fetch(pdfDataUrl);
    const blob = await response.blob();
    
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `directives_${timestamp}.pdf`;
    const filepath = `${userId}/${filename}`;
    
    console.log("[PDFStorage] Uploading PDF to storage path:", filepath);
    
    // Upload to storage
    const { data, error } = await supabase
      .storage
      .from('directives_pdfs')
      .upload(filepath, blob, {
        contentType: 'application/pdf',
        upsert: false
      });
      
    if (error) {
      console.error("[PDFStorage] Error uploading PDF:", error);
      throw error;
    }
    
    console.log("[PDFStorage] PDF uploaded successfully:", data);
    
    // Convert Date to ISO string for database compatibility
    const currentDate = new Date().toISOString();
    
    // Also save reference in the database
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        user_id: userId,
        storage_path: filepath,
        file_name: filename,
        created_at: currentDate, // Now using string format (ISO)
        file_path: filepath
      });
      
    if (dbError) {
      console.error("[PDFStorage] Error saving PDF reference to database:", dbError);
    }
    
    return true;
  } catch (error) {
    console.error("[PDFStorage] Error in savePDFToStorage:", error);
    return false;
  }
};

export const handlePDFDownload = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    console.error("[PDFGeneration] No PDF URL available for download");
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("[PDFGeneration] PDF downloaded successfully");
  } catch (error) {
    console.error("[PDFGeneration] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
};
