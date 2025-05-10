
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { cardDimensions } from "@/components/pdf/utils/constants/cardDimensions";
import { MedicalCardGenerator, MedicalProfile } from "@/utils/medical/MedicalCardGenerator";
import { generateRandomCode } from "@/utils/medical/medicalAccessCodeGenerator";

export interface ProfileData {
  medical_access_code?: string | null;
  last_name?: string | null;
  first_name?: string | null;
  birth_date?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  phone_number?: string | null;
}

export interface MedicalCardResult {
  success: boolean;
  message?: string;
  url?: string;
  filePath?: string;
  fileName?: string;
}

export class MedicalCardService {
  /**
   * Ensures the user has a medical access code
   */
  static async ensureMedicalAccessCode(userId: string, profileData: ProfileData): Promise<string> {
    let medicalAccessCode = profileData.medical_access_code;
    
    if (!medicalAccessCode) {
      medicalAccessCode = generateRandomCode(8);
      
      // Save the new code in the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ medical_access_code: medicalAccessCode })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error saving medical access code:", updateError);
        throw new Error("Impossible de générer un code d'accès médical");
      }
        
      console.log("Nouveau code d'accès médical généré:", medicalAccessCode);
    } else {
      console.log("Code d'accès médical existant:", medicalAccessCode);
    }

    return medicalAccessCode;
  }

  /**
   * Creates a medical profile object from user data and questionnaire data
   */
  static createMedicalProfile(
    userId: string, 
    profileData: ProfileData,
    medicalAccessCode: string,
    medicalData: any[],
  ): MedicalProfile {
    // Extract data from questionnaire if available
    let latestData: Record<string, any> = {};
    let allergies: string[] = [];
    let bloodType = "";

    if (medicalData && medicalData.length > 0) {
      console.log("Données médicales trouvées:", medicalData[0]);
      if (medicalData[0] && medicalData[0].data) {
        latestData = medicalData[0].data;
        
        // Extract allergies if available
        if (latestData.allergies && Array.isArray(latestData.allergies)) {
          allergies = latestData.allergies;
        }
        
        // Get blood type if exists
        if (medicalData[0].blood_type) {
          bloodType = medicalData[0].blood_type;
        }
      }
    }

    return {
      last_name: profileData.last_name || (latestData.nom as string) || "",
      first_name: profileData.first_name || (latestData.prenom as string) || "",
      birth_date: profileData.birth_date || (latestData.date_naissance as string) || "",
      unique_identifier: userId,
      medical_access_code: medicalAccessCode,
      blood_type: bloodType || "",
      allergies: allergies,
      address: profileData.address || "",
      city: profileData.city || "",
      postal_code: profileData.postal_code || "",
      phone_number: profileData.phone_number || ""
    };
  }

  /**
   * Generates the PDF for the medical card
   */
  static generateMedicalCardPDF(profile: MedicalProfile): jsPDF {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [cardDimensions.width, cardDimensions.height]
    });

    MedicalCardGenerator.generate(doc, profile);
    return doc;
  }

  /**
   * Uploads the PDF to Supabase storage and creates a database record
   */
  static async uploadMedicalCard(
    userId: string, 
    pdfDataUrl: string, 
    fileName: string,
  ): Promise<MedicalCardResult> {
    try {
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();
      
      const timestamp = new Date().getTime();
      const filePath = `medical_cards/${userId}_${timestamp}.pdf`;
      
      console.log("Téléchargement du PDF vers:", filePath);
      
      // Tenter l'upload du fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical_documents')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Error uploading PDF:", uploadError);
        throw new Error("Impossible d'uploader le fichier PDF. Vérifiez que le bucket 'medical_documents' existe dans Supabase Storage.");
      }
      
      console.log("Fichier téléchargé avec succès:", uploadData);
      
      // Get a public URL for the file
      const { data: urlData } = await supabase.storage
        .from('medical_documents')
        .createSignedUrl(filePath, 3600);
        
      console.log("URL signée générée:", urlData?.signedUrl);
      
      // Add entry to medical documents table
      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert({
          user_id: userId,
          file_path: filePath,
          file_name: fileName,
          file_type: 'application/pdf',
          file_size: Math.round(blob.size),
          description: "Carte d'accès aux données médicales"
        });
        
      if (dbError) {
        console.error("Error saving document reference:", dbError);
        throw new Error("Impossible d'enregistrer la référence du document dans la base de données");
      }

      return {
        success: true,
        url: urlData?.signedUrl || '',
        filePath,
        fileName
      };
    } catch (error: any) {
      console.error("Error in uploadMedicalCard:", error);
      
      // Return false but also download URL for manual download fallback
      return {
        success: false,
        message: error?.message || "Erreur lors de la sauvegarde de la carte",
        url: pdfDataUrl
      };
    }
  }
}
