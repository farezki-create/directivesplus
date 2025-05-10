
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProgressTracker } from "@/hooks/useProgressTracker";
import { MedicalCardService } from "@/services/medicalCardService";

export function useMedicalCardGenerator(medicalData: any[]) {
  const { progress, isProcessing: isGenerating, startProgress, completeProgress } = useProgressTracker();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerateMedicalCard = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer la carte d'accès",
        variant: "destructive"
      });
      return;
    }

    const cleanupProgress = startProgress();

    try {
      console.log("Début de la génération de la carte médicale");
      
      // Fetch profile information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Error fetching profile:", profileError);
        throw new Error("Profil utilisateur non trouvé");
      }

      // Ensure the user has a medical access code
      const medicalAccessCode = await MedicalCardService.ensureMedicalAccessCode(user.id, profileData);
      
      // Create the medical profile
      const medicalProfile = MedicalCardService.createMedicalProfile(
        user.id,
        profileData,
        medicalAccessCode,
        medicalData
      );

      // Generate the PDF
      const doc = MedicalCardService.generateMedicalCardPDF(medicalProfile);
      
      // Get the PDF as a data URL
      const pdfDataUrl = doc.output('dataurlstring');
      const fileName = `Carte_medicale_${medicalProfile.last_name}_${Date.now()}.pdf`;

      if (pdfDataUrl) {
        // Upload the medical card
        const result = await MedicalCardService.uploadMedicalCard(
          user.id,
          pdfDataUrl,
          fileName
        );

        if (result.success) {
          toast({
            title: "Succès",
            description: "La carte d'accès médicale a été générée et enregistrée dans vos documents médicaux"
          });
          
          // Redirect to medical data page after a short delay
          setTimeout(() => {
            navigate("/medical-data");
          }, 1000);
        } else {
          // Even if storage fails, we can offer to download the PDF
          const link = document.createElement('a');
          link.href = pdfDataUrl;
          link.download = fileName;
          link.click();
          
          toast({
            title: "Information",
            description: "La carte d'accès a été générée mais n'a pas pu être sauvegardée. Elle a été téléchargée sur votre appareil."
          });
        }
      }
    } catch (error: any) {
      console.error("Error generating medical card:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de générer la carte d'accès médicale",
        variant: "destructive"
      });
    } finally {
      completeProgress();
      cleanupProgress();
    }
  };

  return {
    isGenerating,
    progress,
    handleGenerateMedicalCard
  };
}
