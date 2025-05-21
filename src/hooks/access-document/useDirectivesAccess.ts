
import { useState } from "react";
import { FormData } from "@/utils/access-document/validationSchema";
import { checkDirectivesAccessCode, checkProfileMatch } from "@/utils/access-document/databaseUtils";
import { showErrorToast, showSuccessToast } from "@/utils/access-document/toastUtils";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";

// Type pour le résultat de l'accès
export interface DirectivesAccessResult {
  success: boolean;
  error?: string;
  userId?: string;
  accessCodeId?: string;
  directiveId?: string;
}

// Fonction pour accéder aux directives
export const accessDirectives = async (formData: FormData): Promise<DirectivesAccessResult> => {
  console.log("Données du formulaire pour directives:", formData);
  
  try {
    // Identifier pour la détection de force brute
    const bruteForceIdentifier = `directives_${formData.lastName.substring(0, 3)}_${formData.firstName.substring(0, 3)}`;
    
    // Vérifier si l'utilisateur n'est pas bloqué pour force brute
    const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
    
    if (!bruteForceCheck.allowed) {
      showErrorToast("Accès bloqué", "Trop de tentatives. Veuillez réessayer plus tard.");
      return {
        success: false,
        error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.`
      };
    }

    // Vérifier le code d'accès
    const accessCodesData = await checkDirectivesAccessCode(formData.accessCode);
    
    if (!accessCodesData || accessCodesData.length === 0) {
      console.log("Code d'accès invalide");
      showErrorToast("Accès refusé", "Code d'accès invalide");
      return { 
        success: false,
        error: "Code d'accès invalide"
      };
    }
    
    // Vérifier les informations personnelles
    const userId = accessCodesData[0].user_id;
    const { isMatch, profile } = await checkProfileMatch(userId, formData);
    
    if (!isMatch) {
      console.log("Informations personnelles incorrectes");
      showErrorToast("Accès refusé", "Informations personnelles incorrectes");
      return {
        success: false,
        error: "Informations personnelles incorrectes" 
      };
    }
    
    // Accès accordé
    console.log("Accès aux directives accordé");
    resetBruteForceCounter(bruteForceIdentifier);
    showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
    
    // Redirection vers la page de directives après un court délai
    setTimeout(() => {
      window.location.href = '/directives-anticipees';
    }, 1000);
    
    return {
      success: true,
      userId,
      accessCodeId: formData.accessCode,
      directiveId: formData.accessCode // À remplacer par l'ID réel des directives
    };
  } catch (error: any) {
    console.error("Erreur d'accès aux directives:", error);
    showErrorToast(
      "Erreur", 
      "Une erreur est survenue lors de la vérification de l'accès"
    );
    
    return {
      success: false,
      error: error.message || "Une erreur est survenue"
    };
  }
};
