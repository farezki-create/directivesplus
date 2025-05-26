
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  extracted_content?: string;
  description?: string;
}

export const generateMedicalCompilationPDF = async (
  documents: MedicalDocument[],
  userId: string
): Promise<string> => {
  try {
    console.log("=== GÉNÉRATION PDF COMPILATION MÉDICALE ===");
    console.log("Documents à compiler:", documents.length);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const layout: PdfLayout = {
      margin: 20,
      pageWidth: pdf.internal.pageSize.getWidth(),
      pageHeight: pdf.internal.pageSize.getHeight(),
      lineHeight: 7,
      contentWidth: pdf.internal.pageSize.getWidth() - 40,
      footerHeight: 20
    };

    let yPosition = layout.margin;

    // En-tête du document de compilation
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("COMPILATION DE DOCUMENTS MÉDICAUX", layout.pageWidth / 2, yPosition, { align: "center" });
    yPosition += layout.lineHeight * 2;

    // Date de compilation
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const dateCompilation = `Compilé le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
    pdf.text(dateCompilation, layout.pageWidth / 2, yPosition, { align: "center" });
    yPosition += layout.lineHeight * 1.5;

    // Nombre de documents
    const nbDocuments = `Nombre de documents: ${documents.length}`;
    pdf.text(nbDocuments, layout.pageWidth / 2, yPosition, { align: "center" });
    yPosition += layout.lineHeight * 2;

    // Ligne de séparation
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1);
    pdf.line(layout.margin, yPosition, layout.margin + layout.contentWidth, yPosition);
    yPosition += layout.lineHeight * 2;

    // Sommaire
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("SOMMAIRE", layout.margin, yPosition);
    yPosition += layout.lineHeight * 1.5;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    documents.forEach((doc, index) => {
      const sommaireLine = `${index + 1}. ${doc.file_name}`;
      pdf.text(sommaireLine, layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
    });

    yPosition += layout.lineHeight;

    // Rendu de chaque document
    documents.forEach((doc, index) => {
      console.log(`Rendu du document ${index + 1}: ${doc.file_name}`);
      
      // Nouvelle page pour chaque document (sauf le premier s'il y a de la place)
      if (index > 0 || yPosition + layout.lineHeight * 20 > layout.pageHeight - layout.footerHeight) {
        pdf.addPage();
        yPosition = layout.margin;
      }
      
      // Titre du document
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      const documentTitle = `DOCUMENT ${index + 1}: ${doc.file_name}`;
      pdf.text(documentTitle, layout.margin, yPosition);
      yPosition += layout.lineHeight * 1.2;
      
      // Informations du document
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      
      const dateText = `Date d'ajout: ${new Date(doc.created_at).toLocaleDateString('fr-FR')}`;
      pdf.text(dateText, layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
      
      if (doc.description && doc.description !== `Document médical: ${doc.file_name}`) {
        const descText = `Description: ${doc.description}`;
        const descLines = pdf.splitTextToSize(descText, layout.contentWidth - 10);
        pdf.text(descLines, layout.margin + 5, yPosition);
        yPosition += descLines.length * layout.lineHeight;
      }
      
      // Ligne de séparation
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.3);
      pdf.line(layout.margin, yPosition, layout.margin + layout.contentWidth, yPosition);
      yPosition += layout.lineHeight * 0.8;
      
      // Contenu du document
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      
      if (doc.extracted_content && doc.extracted_content.trim()) {
        console.log(`Ajout du contenu extrait pour ${doc.file_name}`);
        
        // Vérifier l'espace disponible
        const contentLines = pdf.splitTextToSize(doc.extracted_content, layout.contentWidth - 10);
        const neededHeight = contentLines.length * layout.lineHeight;
        
        if (yPosition + neededHeight > layout.pageHeight - layout.footerHeight) {
          pdf.addPage();
          yPosition = layout.margin;
        }
        
        pdf.text(contentLines, layout.margin + 5, yPosition);
        yPosition += contentLines.length * layout.lineHeight;
      } else {
        console.log(`Pas de contenu extrait pour ${doc.file_name}`);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(150, 150, 150);
        const noContentText = "Contenu non extrait. Document original disponible séparément.";
        const noContentLines = pdf.splitTextToSize(noContentText, layout.contentWidth - 10);
        pdf.text(noContentLines, layout.margin + 5, yPosition);
        yPosition += noContentLines.length * layout.lineHeight;
        pdf.setTextColor(0, 0, 0);
      }
      
      yPosition += layout.lineHeight * 2; // Espacement entre documents
    });

    // Pied de page avec informations de compilation
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      
      const footerText = `Compilation de ${documents.length} document(s) médical(aux) - Page ${i}/${totalPages}`;
      pdf.text(footerText, layout.pageWidth / 2, layout.pageHeight - 10, { align: "center" });
      
      const compileInfo = `Généré le ${new Date().toLocaleDateString('fr-FR')} via DirectivesPlus`;
      pdf.text(compileInfo, layout.pageWidth / 2, layout.pageHeight - 5, { align: "center" });
    }

    console.log("=== COMPILATION PDF TERMINÉE ===");
    console.log("Nombre total de pages:", totalPages);
    
    const pdfOutput = pdf.output("datauristring");
    
    if (!pdfOutput || typeof pdfOutput !== 'string' || pdfOutput.length < 100) {
      throw new Error("La génération du PDF de compilation a échoué");
    }
    
    console.log("PDF de compilation généré avec succès, taille:", pdfOutput.length, "caractères");
    return pdfOutput;
    
  } catch (error) {
    console.error("Erreur dans la génération du PDF de compilation:", error);
    throw error;
  }
};
