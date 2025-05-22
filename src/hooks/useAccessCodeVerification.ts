
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
    documentPath?: string, // Optional document path for direct document inclusion
    documentList?: any[] // Optional list of documents for list format display
  ) => {
    try {
      setIsVerifying(true);
      console.log("Vérification du code:", accessCode, "pour", patientName, "avec document:", documentPath);
      
      // Pour les utilisateurs authentifiés, nous pouvons contourner la vérification du code
      if (bypassCodeCheck) {
        logVerificationResult(true, "Authenticated user bypass", {documentPath, hasDocumentList: !!documentList});
        console.log("Authenticated user bypass with document:", documentPath);
        
        // Obtenir le dossier utilisateur authentifié avec le chemin de document optionnel
        const authResult = await getAuthUserDossier(patientName, documentType, documentPath);
        
        if (authResult.success) {
          console.log("Dossier authentifié récupéré avec succès:", authResult.dossier);
          
          // Add document URL if provided
          if (documentPath && !authResult.dossier.contenu.document_url) {
            console.log("Ajout manuel de l'URL du document au dossier:", documentPath);
            authResult.dossier.contenu.document_url = documentPath;
          }
          
          // Add document list if provided
          if (documentList && documentList.length > 0) {
            console.log("Ajout manuel de la liste de documents au dossier:", documentList);
            authResult.dossier.contenu.documents = documentList;
          }
          
          setVerificationResult({
            success: true,
            data: authResult.dossier,
            accessType: documentType
          });
          setRemainingAttempts(3); // Réinitialiser les tentatives
          return authResult.dossier;
        } else {
          console.error("Échec de la récupération du dossier authentifié:", authResult.error);
          throw new Error(authResult.error || "Échec de la récupération du dossier authentifié");
        }
      }
      
      // Vérification régulière du code pour les utilisateurs non authentifiés
      const result = await verifyAccessCode(
        accessCode,
        patientName,
        patientBirthDate,
        documentType
      );
      
      if (result.success) {
        logVerificationResult(true, "Code validated successfully", result);
        console.log("Code validé avec succès:", result.dossier);
        
        // S'assurer que le document_url est disponible si fourni
        if (documentPath && !result.dossier.contenu.document_url) {
          console.log("Ajout manuel de l'URL du document au dossier:", documentPath);
          result.dossier.contenu.document_url = documentPath;
        }
        
        // S'assurer que la liste de documents est disponible si fournie
        if (documentList && documentList.length > 0 && !result.dossier.contenu.documents) {
          console.log("Ajout manuel de la liste de documents au dossier:", documentList);
          result.dossier.contenu.documents = documentList;
        }
        
        setVerificationResult({
          success: true,
          data: result.dossier,
          accessType: documentType
        });
        setRemainingAttempts(3); // Réinitialiser les tentatives en cas de succès
        return result.dossier;
      } else {
        logVerificationResult(false, result.error || "Invalid access code");
        console.error("Échec de la validation du code:", result.error);
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
