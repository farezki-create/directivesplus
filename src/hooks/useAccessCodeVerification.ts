
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Définir des types simples pour éviter le problème de "Type instantiation is excessively deep"
interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  [key: string]: any;
}

// Type simplifié pour le résultat de vérification
type VerificationResult = {
  success: boolean;
  data?: any;
  message?: string;
  accessType?: string;
};

export const useAccessCodeVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  const verifyAccessCode = async (
    accessCode: string,
    patientName: string,
    patientBirthDate: string,
    documentType: "medical" | "directive" = "directive"
  ) => {
    try {
      setIsVerifying(true);
      console.log(`Vérification du code ${accessCode} pour ${patientName} né(e) le ${patientBirthDate}`);

      const bruteForceIdentifier = `${documentType}_access_${patientName}_${patientBirthDate}`;
      
      // Appel à la fonction Edge verifierCodeAcces
      const response = await fetch(`https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode,
          patientName,
          patientBirthDate,
          bruteForceIdentifier
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Vérification réussie:", result);
        setVerificationResult({
          success: true,
          data: result.dossier,
          accessType: documentType
        });
        setRemainingAttempts(3); // Réinitialiser les tentatives
        return result.dossier;
      } else {
        console.log("Échec de la vérification:", result);
        setRemainingAttempts(prev => Math.max(0, prev - 1));
        setVerificationResult({
          success: false,
          message: result.error || "Code d'accès invalide ou document introuvable"
        });
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      setRemainingAttempts(prev => Math.max(0, prev - 1));
      setVerificationResult({
        success: false,
        message: "Une erreur est survenue lors de la vérification"
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const getMedicalDocuments = async (userId: string): Promise<MedicalDocument[]> => {
    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as MedicalDocument[];
    } catch (error) {
      console.error("Erreur lors de la récupération des documents médicaux:", error);
      return [];
    }
  };

  return {
    isVerifying,
    verificationResult,
    remainingAttempts,
    blockedAccess: remainingAttempts === 0,
    verifyAccessCode,
    getMedicalDocuments
  };
};
