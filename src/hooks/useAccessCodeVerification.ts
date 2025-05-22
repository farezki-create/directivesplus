
import { useState } from "react";
import { verifyAccessCode, getMedicalDocuments, MedicalDocument, getAuthUserDossier } from "@/api/accessCodeVerification";
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
    bypassCodeCheck = false, // Parameter for authenticated users
    documentPath?: string // Optional document path for direct document inclusion
  ) => {
    try {
      setIsVerifying(true);
      console.log("[useAccessCodeVerification] Vérification initiée:", {
        bypassCodeCheck,
        documentPath: documentPath ? "présent" : "absent",
        accessType: documentType
      });
      
      // For authenticated users with document path, create direct dossier
      if (bypassCodeCheck && documentPath) {
        logVerificationResult(true, "Accès direct au document pour utilisateur authentifié");
        console.log("[useAccessCodeVerification] Document direct pour utilisateur authentifié:", documentPath);
        
        const directDossier = {
          id: `direct-${Date.now()}`,
          userId: patientName, // User ID is passed in patientName for authenticated users
          isFullAccess: true,
          isDirectivesOnly: documentType === "directive",
          isMedicalOnly: documentType === "medical",
          profileData: null,
          contenu: {
            document_url: documentPath,
            document_name: documentPath.split('/').pop() || "document",
            patient: {
              nom: "Utilisateur",
              prenom: "Authentifié",
              date_naissance: new Date().toISOString().split('T')[0],
            }
          }
        };
        
        console.log("[useAccessCodeVerification] Dossier direct créé:", directDossier);
        setVerificationResult({
          success: true,
          data: directDossier,
          accessType: documentType
        });
        setRemainingAttempts(3);
        return directDossier;
      }
      
      // For authenticated users without specific document
      if (bypassCodeCheck) {
        logVerificationResult(true, "Authenticated user bypass");
        
        // Get auth user dossier
        const authResult = await getAuthUserDossier(patientName, documentType, documentPath);
        
        if (authResult.success) {
          console.log("[useAccessCodeVerification] Dossier authentifié récupéré");
          
          // Ensure document is in the dossier if provided
          if (documentPath && authResult.dossier) {
            console.log("[useAccessCodeVerification] Ajout du document au dossier:", documentPath);
            authResult.dossier.contenu.document_url = documentPath;
            authResult.dossier.contenu.document_name = documentPath.split('/').pop() || "document";
          }
          
          setVerificationResult({
            success: true,
            data: authResult.dossier,
            accessType: documentType
          });
          setRemainingAttempts(3);
          return authResult.dossier;
        } else {
          console.error("[useAccessCodeVerification] Échec récupération dossier:", authResult.error);
          throw new Error(authResult.error || "Échec de récupération");
        }
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
        
        // If there's a document path, make sure it's included in the dossier
        if (documentPath && result.dossier) {
          console.log("[useAccessCodeVerification] Ajout document au dossier vérifié:", documentPath);
          result.dossier.contenu.document_url = documentPath;
          result.dossier.contenu.document_name = documentPath.split('/').pop() || "document";
        }
        
        setVerificationResult({
          success: true,
          data: result.dossier,
          accessType: documentType
        });
        setRemainingAttempts(3);
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
      console.error("[useAccessCodeVerification] Erreur verification:", error);
      setRemainingAttempts(prev => Math.max(0, prev - 1));
      setVerificationResult({
        success: false,
        message: error instanceof Error ? error.message : "Une erreur est survenue lors de la vérification"
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
