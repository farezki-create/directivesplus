
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
    if (!user || !medicalData || medicalData.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucune donnée médicale disponible pour générer la carte",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Récupérer les informations du profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        throw new Error("Profil utilisateur non trouvé");
      }

      // Préparer les données du profil médical
      const latestData = medicalData[0]?.data || {};
      
      // Extraire les allergies (si disponibles)
      let allergies: string[] = [];
      if (latestData.allergies && Array.isArray(latestData.allergies)) {
        allergies = latestData.allergies;
      }

      // Créer le profil médical
      const medicalProfile: MedicalProfile = {
        last_name: profileData.last_name || latestData.nom,
        first_name: profileData.first_name || latestData.prenom,
        birth_date: profileData.birth_date || latestData.date_naissance,
        unique_identifier: medicalData[0]?.access_code,
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

      // Enregistrer le PDF dans Supabase Storage
      if (pdfDataUrl) {
        const base64Data = pdfDataUrl.split(',')[1];
        const fileName = `medical_cards/${user.id}_medical_card_${Date.now()}.pdf`;
        
        const { error: uploadError } = await supabase.storage
          .from('medical_documents')
          .upload(fileName, decode(base64Data), {
            contentType: 'application/pdf'
          });

        if (uploadError) {
          throw uploadError;
        }

        // Ajouter le document à la table de documents
        const { error: dbError } = await supabase
          .from('medical_documents')
          .insert({
            user_id: user.id,
            file_path: fileName,
            file_name: 'Carte d\'accès médicale.pdf',
            file_type: 'application/pdf',
            file_size: Math.round(base64Data.length * 0.75),
            description: 'Carte d\'accès aux données médicales'
          });

        if (dbError) {
          throw dbError;
        }

        toast({
          title: "Succès",
          description: "La carte d'accès médicale a été générée et enregistrée avec succès"
        });
        
        // Ouvrir le PDF dans un nouvel onglet
        window.open(URL.createObjectURL(
          new Blob([decode(base64Data)], { type: 'application/pdf' })
        ), '_blank');
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
      disabled={isGenerating || !medicalData || medicalData.length === 0}
      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
    >
      <CreditCard className="h-4 w-4" />
      {isGenerating ? "Génération en cours..." : "Générer ma carte d'accès à mes données médicales"}
    </Button>
  );
}
