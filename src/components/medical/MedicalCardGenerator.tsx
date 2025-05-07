
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cardDimensions } from "@/components/pdf/utils/constants/cardDimensions";
import { MedicalCardGenerator as MedicalCardGeneratorUtil, MedicalProfile } from "@/utils/medical/MedicalCardGenerator";

interface MedicalCardGeneratorProps {
  medicalData: any[];
}

export function MedicalCardGenerator({ medicalData }: MedicalCardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

      // Préparer les données du profil médical
      let latestData: Record<string, any> = {};
      let accessCode = "";
      let allergies: string[] = [];

      // Récupérer les données du questionnaire si disponibles
      if (medicalData && medicalData.length > 0) {
        if (medicalData[0] && medicalData[0].data) {
          latestData = medicalData[0].data;
          accessCode = medicalData[0].access_code || "";
          
          // Extraire les allergies (si disponibles)
          if (latestData.allergies && Array.isArray(latestData.allergies)) {
            allergies = latestData.allergies;
          }
        }
      }

      // Créer le profil médical
      const medicalProfile: MedicalProfile = {
        last_name: profileData.last_name || (latestData.nom as string) || "",
        first_name: profileData.first_name || (latestData.prenom as string) || "",
        birth_date: profileData.birth_date || (latestData.date_naissance as string) || "",
        unique_identifier: accessCode || "Non défini",
        allergies: allergies
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

      // Enregistrer le PDF directement (sans stocker dans Supabase)
      if (pdfDataUrl) {
        const base64Data = pdfDataUrl.split(',')[1];
        
        // Ouvrir le PDF dans un nouvel onglet
        window.open(URL.createObjectURL(
          new Blob([decode(base64Data)], { type: 'application/pdf' })
        ), '_blank');

        toast({
          title: "Succès",
          description: "La carte d'accès médicale a été générée avec succès"
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
      setIsGenerating(false);
    }
  };

  // Fonction pour décoder une chaîne base64
  function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <Button
      onClick={handleGenerateMedicalCard}
      disabled={isGenerating || !user}
      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
    >
      <CreditCard className="h-4 w-4" />
      {isGenerating ? "Génération en cours..." : "Générer ma carte d'accès à mes données médicales"}
    </Button>
  );
}
