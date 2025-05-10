
import { useState } from "react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cardDimensions } from "@/components/pdf/utils/constants/cardDimensions";
import { MedicalCardGenerator as MedicalCardGeneratorUtil, MedicalProfile } from "@/utils/medical/MedicalCardGenerator";

export function useMedicalCardGenerator(medicalData: any[]) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateProgress = () => {
    // Simulate progress updates
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  // Function to generate a random code
  const generateRandomCode = (length: number): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Function to decode a base64 string
  const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleGenerateMedicalCard = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer la carte d'accès",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const cleanupProgress = updateProgress();

    try {
      // Récupérer les informations du profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Profil utilisateur non trouvé");
      }

      if (!profileData) {
        throw new Error("Profil utilisateur non trouvé");
      }

      // Vérifier si le code d'accès médical existe
      let medicalAccessCode = profileData.medical_access_code;
      
      // Si le code d'accès médical n'existe pas, en générer un nouveau
      if (!medicalAccessCode) {
        medicalAccessCode = generateRandomCode(8);
        
        // Sauvegarder le nouveau code dans le profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ medical_access_code: medicalAccessCode })
          .eq('id', user.id);
          
        if (updateError) {
          console.error("Error saving medical access code:", updateError);
          throw new Error("Impossible de générer un code d'accès médical");
        }
          
        console.log("Nouveau code d'accès médical généré:", medicalAccessCode);
      } else {
        console.log("Code d'accès médical existant:", medicalAccessCode);
      }

      // Préparer les données du profil médical
      let latestData: Record<string, any> = {};
      let allergies: string[] = [];
      let bloodType = "";

      // Récupérer les données du questionnaire si disponibles
      if (medicalData && medicalData.length > 0) {
        if (medicalData[0] && medicalData[0].data) {
          latestData = medicalData[0].data;
          
          // Extraire les allergies (si disponibles)
          if (latestData.allergies && Array.isArray(latestData.allergies)) {
            allergies = latestData.allergies;
          }
          
          // Récupérer le groupe sanguin s'il existe
          if (medicalData[0].blood_type) {
            bloodType = medicalData[0].blood_type;
          }
        }
      }

      // Créer le profil médical
      const medicalProfile: MedicalProfile = {
        last_name: profileData.last_name || (latestData.nom as string) || "",
        first_name: profileData.first_name || (latestData.prenom as string) || "",
        birth_date: profileData.birth_date || (latestData.date_naissance as string) || "",
        unique_identifier: user.id,
        medical_access_code: medicalAccessCode, // Utiliser le code d'accès médical
        blood_type: bloodType || "",
        allergies: allergies,
        address: profileData.address || "",
        city: profileData.city || "",
        postal_code: profileData.postal_code || "",
        phone_number: profileData.phone_number || ""
      };

      // Créer le document PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [cardDimensions.width, cardDimensions.height]
      });

      // Générer la carte médicale
      MedicalCardGeneratorUtil.generate(doc, medicalProfile);

      // Obtenir le PDF sous forme de données URL
      const pdfDataUrl = doc.output('dataurlstring');
      const fileName = `Carte_medicale_${medicalProfile.last_name}_${Date.now()}.pdf`;

      if (pdfDataUrl) {
        const base64Data = pdfDataUrl.split(',')[1];
        
        // Enregistrer le document dans la table medical_documents
        const filePath = `medical_cards/${user.id}_${Date.now()}.pdf`;
        
        // Upload du fichier dans le storage
        const { error: uploadError } = await supabase.storage
          .from('medical_documents')
          .upload(filePath, decode(base64Data), {
            contentType: 'application/pdf'
          });
          
        if (uploadError) {
          console.error("Error uploading PDF:", uploadError);
          throw new Error("Impossible d'enregistrer le fichier PDF");
        }
        
        // Ajouter l'entrée dans la table des documents médicaux
        const { error: dbError } = await supabase
          .from('medical_documents')
          .insert({
            user_id: user.id,
            file_path: filePath,
            file_name: fileName,
            file_type: 'application/pdf',
            file_size: Math.round(base64Data.length * 0.75),
            description: "Carte d'accès aux données médicales"
          });
          
        if (dbError) {
          console.error("Error saving document reference:", dbError);
          throw new Error("Impossible d'enregistrer la référence du document");
        }

        toast({
          title: "Succès",
          description: "La carte d'accès médicale a été générée et enregistrée dans vos documents médicaux"
        });
      }
    } catch (error) {
      console.error("Error generating medical card:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte d'accès médicale",
        variant: "destructive"
      });
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
      cleanupProgress();
    }
  };

  return {
    isGenerating,
    progress,
    handleGenerateMedicalCard
  };
}
