
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

/**
 * Hook to handle questionnaire submission and PDF generation
 */
export function useMedicalQuestionnaireSubmit({ onDataSaved }: { onDataSaved?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Convert a base64 string to an array buffer
   */
  function base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  
  /**
   * Submit questionnaire data and generate PDF
   */
  const onSubmit = async (data: MedicalQuestionnaireData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos données",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sauvegarder les données en base
      const { error } = await supabase
        .from('questionnaire_medical')
        .insert({
          user_id: user.id,
          ...data
        });

      if (error) throw error;
      
      // Générer le PDF
      const doc = generatePDF(data);
      
      // Obtenir le PDF comme data URL
      const pdfOutput = doc.output('dataurlstring');
      const fileName = `Questionnaire_medical_${data.nom || "patient"}_${Date.now()}.pdf`;
      
      // Enregistrer le PDF dans les documents médicaux
      if (pdfOutput) {
        const base64Data = pdfOutput.split(',')[1];
        const filePath = `medical_docs/${user.id}_${Date.now()}.pdf`;
        
        // Upload du fichier dans le storage
        const { error: uploadError } = await supabase.storage
          .from('medical_documents')
          .upload(filePath, base64ToArrayBuffer(base64Data), {
            contentType: 'application/pdf'
          });
        
        if (uploadError) {
          console.error("Erreur lors de l'upload du PDF:", uploadError);
          throw uploadError;
        }
        
        // Enregistrer la référence dans la base de données
        const { error: dbError } = await supabase
          .from('medical_documents')
          .insert({
            user_id: user.id,
            file_path: filePath,
            file_name: fileName,
            file_type: 'application/pdf',
            file_size: Math.round(base64Data.length * 0.75),
            description: "Questionnaire médical"
          });
        
        if (dbError) {
          console.error("Erreur lors de l'enregistrement de la référence du document:", dbError);
          throw dbError;
        }
      }

      toast({
        title: "Succès",
        description: "Questionnaire médical enregistré avec succès",
      });

      if (onDataSaved) onDataSaved();

    } catch (error) {
      console.error("Error saving questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du questionnaire",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a PDF document from the questionnaire data
   */
  const generatePDF = (data: MedicalQuestionnaireData) => {
    const { jsPDF } = require("jspdf");
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Ajouter les données du questionnaire au PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Questionnaire médical", 105, 20, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 40;
    
    // Informations générales
    doc.setFont("helvetica", "bold");
    doc.text("Informations générales", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Nom: ${data.nom || ""}`, 20, y); y += 7;
    doc.text(`Prénom: ${data.prenom || ""}`, 20, y); y += 7;
    doc.text(`Date de naissance: ${data.date_naissance || ""}`, 20, y); y += 7;
    doc.text(`Sexe: ${data.sexe || ""}`, 20, y); y += 7;
    doc.text(`Adresse: ${data.adresse || ""}`, 20, y); y += 7;
    doc.text(`Téléphone: ${data.telephone || ""}`, 20, y); y += 7;
    doc.text(`Personne à prévenir: ${data.personne_prevenir || ""}`, 20, y); y += 10;
    
    // Allergies
    doc.setFont("helvetica", "bold");
    doc.text("Allergies", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    if (data.allergies && data.allergies.length > 0) {
      data.allergies.forEach((allergie: string) => {
        doc.text(`- ${allergie}`, 20, y);
        y += 7;
      });
    } else {
      doc.text("Aucune allergie déclarée", 20, y);
      y += 7;
    }
    y += 3;
    
    // Pathologies
    doc.setFont("helvetica", "bold");
    doc.text("Pathologies", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    if (data.pathologies && data.pathologies.length > 0) {
      data.pathologies.forEach((pathologie: string) => {
        doc.text(`- ${pathologie}`, 20, y);
        y += 7;
      });
    } else {
      doc.text("Aucune pathologie déclarée", 20, y);
      y += 7;
    }

    return doc;
  };
  
  return { 
    onSubmit, 
    isLoading 
  };
}
