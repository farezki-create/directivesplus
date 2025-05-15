
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PdfData {
  profileData: any;
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
  signature: string;
  userId?: string;
}

export const generatePDF = async (data: PdfData): Promise<any> => {
  try {
    console.log("Génération du PDF avec les données:", data);
    
    // Créer un nouvel objet PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    // Variables pour gérer la position et mise en page
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const lineHeight = 7;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Fonctions utilitaires
    const addTitle = (text: string) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(41, 82, 155);
      pdf.text(text, pageWidth / 2, yPosition, { align: "center" });
      yPosition += lineHeight * 1.5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
    };
    
    const addSubtitle = (text: string) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(70, 70, 70);
      pdf.text(text, margin, yPosition);
      yPosition += lineHeight;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
    };
    
    const addParagraph = (text: string) => {
      const splitText = pdf.splitTextToSize(text, contentWidth);
      pdf.text(splitText, margin, yPosition);
      yPosition += (splitText.length * lineHeight);
    };
    
    const checkPageBreak = (heightNeeded: number = lineHeight * 5) => {
      if (yPosition + heightNeeded > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };
    
    // Entête du document
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(41, 82, 155);
    pdf.text("DIRECTIVES ANTICIPÉES", pageWidth / 2, yPosition, { align: "center" });
    yPosition += lineHeight * 2;
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    
    // Ajouter la date
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Document généré le ${dateStr}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += lineHeight * 2;
    
    // Informations personnelles
    checkPageBreak();
    addTitle("Informations Personnelles");
    
    if (data.profileData) {
      const { first_name, last_name, birth_date, address } = data.profileData;
      const birthDateFormatted = birth_date ? new Date(birth_date).toLocaleDateString('fr-FR') : 'Non spécifié';
      
      addParagraph(`Nom: ${last_name || 'Non spécifié'}`);
      addParagraph(`Prénom: ${first_name || 'Non spécifié'}`);
      addParagraph(`Date de naissance: ${birthDateFormatted}`);
      
      if (address) {
        addParagraph(`Adresse: ${address}`);
      }
      
      yPosition += lineHeight;
    } else {
      addParagraph("Aucune information personnelle disponible");
    }
    
    // Personnes de confiance
    checkPageBreak();
    addTitle("Personnes de Confiance");
    
    if (data.trustedPersons && data.trustedPersons.length > 0) {
      data.trustedPersons.forEach((person, index) => {
        checkPageBreak();
        addSubtitle(`Personne de confiance ${index + 1}`);
        
        addParagraph(`Nom: ${person.last_name || 'Non spécifié'}`);
        addParagraph(`Prénom: ${person.first_name || 'Non spécifié'}`);
        addParagraph(`Relation: ${person.relationship || 'Non spécifiée'}`);
        addParagraph(`Téléphone: ${person.phone || 'Non spécifié'}`);
        addParagraph(`Email: ${person.email || 'Non spécifié'}`);
        
        yPosition += lineHeight;
      });
    } else {
      addParagraph("Aucune personne de confiance désignée");
    }
    
    // Réponses aux questionnaires
    checkPageBreak();
    addTitle("Mes Souhaits et Préférences");
    
    if (data.responses && Object.keys(data.responses).length > 0) {
      Object.entries(data.responses).forEach(([questionnaireType, questions]) => {
        checkPageBreak();
        
        let title = questionnaireType;
        switch (questionnaireType) {
          case 'avis-general':
            title = "Avis Général";
            break;
          case 'maintien-vie':
            title = "Maintien en Vie";
            break;
          case 'maladie-avancee':
            title = "Maladie Avancée";
            break;
          case 'gouts-peurs':
            title = "Goûts et Peurs";
            break;
          default:
            title = questionnaireType;
        }
        
        addSubtitle(title);
        
        Object.entries(questions).forEach(([_, questionData]: [string, any]) => {
          checkPageBreak(lineHeight * 4);
          
          const question = questionData.question || "Question non définie";
          const response = questionData.response || "Pas de réponse";
          
          pdf.setFont("helvetica", "bold");
          addParagraph(question);
          pdf.setFont("helvetica", "normal");
          addParagraph(`Réponse: ${response}`);
          
          yPosition += lineHeight / 2;
        });
        
        yPosition += lineHeight;
      });
    } else {
      addParagraph("Aucune réponse au questionnaire");
    }
    
    // Phrases d'exemples sélectionnées
    if (data.examplePhrases && data.examplePhrases.length > 0) {
      checkPageBreak();
      addTitle("Phrases d'exemples sélectionnées");
      
      data.examplePhrases.forEach((phrase) => {
        checkPageBreak();
        addParagraph(`• ${phrase}`);
      });
      
      yPosition += lineHeight;
    }
    
    // Phrases personnalisées
    if (data.customPhrases && data.customPhrases.length > 0) {
      checkPageBreak();
      addTitle("Phrases personnalisées");
      
      data.customPhrases.forEach((phrase) => {
        checkPageBreak();
        addParagraph(`• ${phrase}`);
      });
      
      yPosition += lineHeight;
    }
    
    // Texte libre
    if (data.freeText) {
      checkPageBreak();
      addTitle("Expression libre");
      addParagraph(data.freeText);
      yPosition += lineHeight;
    }
    
    // Signature et date
    checkPageBreak(lineHeight * 10);
    addTitle("Signature");
    
    pdf.text(`Date: ${dateStr}`, margin, yPosition);
    yPosition += lineHeight * 2;
    
    if (data.signature) {
      try {
        // Ajouter la signature comme image
        const imgWidth = 50;
        pdf.addImage(data.signature, 'PNG', margin, yPosition, imgWidth, 20);
        yPosition += 20 + lineHeight;
      } catch (error) {
        console.error("Erreur lors de l'ajout de la signature:", error);
        addParagraph("Signature non disponible");
      }
    } else {
      addParagraph("Signature non fournie");
    }
    
    // Générer le PDF
    const pdfOutput = pdf.output("datauristring");
    
    // Stocker des informations sur le PDF généré dans la base de données
    if (data.userId) {
      const fileName = `directives-anticipees-${new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-')}.pdf`;
      
      const currentDateString = new Date().toISOString();
      
      const pdfRecord = {
        user_id: data.userId,
        file_name: fileName,
        file_path: pdfOutput, // Stocke le PDF comme data URI
        content_type: "application/pdf",
        file_size: Math.floor(pdfOutput.length / 1.33), // Estimation approximative de la taille
        description: "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        created_at: currentDateString
      };
      
      const { data: insertedData, error } = await supabase
        .from('pdf_documents')
        .insert(pdfRecord)
        .select();
      
      if (error) {
        console.error("Erreur lors de l'enregistrement du PDF:", error);
        throw error;
      }
      
      return insertedData;
    }
    
    return Promise.resolve(null);
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    return Promise.reject(error);
  }
};
