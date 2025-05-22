
import { useState } from "react";
import { verifyAccessCode, getMedicalDocuments, MedicalDocument } from "@/api/accessCodeVerification";
import { VerificationResult, logVerificationResult } from "@/utils/access/verificationResult";

export const useAccessCodeVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  const verifyCode = async (
    accessCode: string,
    patientName: string,
    patientBirthDate: string,
    documentType: "medical" | "directive" = "directive",
    bypassCodeCheck = false // New parameter for authenticated users
  ) => {
    try {
      setIsVerifying(true);
      
      // For authenticated users, we can bypass the code verification
      if (bypassCodeCheck) {
        logVerificationResult(true, "Authenticated user bypass");
        setVerificationResult({
          success: true,
          data: { authenticated: true }, // Minimal data needed
          accessType: documentType
        });
        setRemainingAttempts(3); // Reset attempts
        return { authenticated: true }; // Return minimal data
      }
      
      // Regular code verification for non-authenticated users
      const result = await verifyAccessCode(
        accessCode,
        patientName,
        patientBirthDate,
        documentType
      );
      
      if (result.success) {
        logVerificationResult(true, "Code validated successfully", result);
        setVerificationResult({
          success: true,
          data: result.dossier,
          accessType: documentType
        });
        setRemainingAttempts(3); // Reset attempts on success
        return result.dossier;
      } else {
        logVerificationResult(false, result.error || "Invalid access code");
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

  return {
    isVerifying,
    verificationResult,
    remainingAttempts,
    blockedAccess: remainingAttempts === 0,
    verifyAccessCode: verifyCode,
    getMedicalDocuments
  };
};
