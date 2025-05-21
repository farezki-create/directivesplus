
import { useState } from "react";
import { FormData } from "@/utils/access-document/validationSchema";
import { checkDirectivesAccessCode, checkProfileMatch } from "@/utils/access-document/databaseUtils";
import { showErrorToast, showSuccessToast } from "@/utils/access-document/toastUtils";
import { checkBruteForceAttempt, resetBruteForceCounter } from "@/utils/securityUtils";

// Type for the result of the access
export interface DirectivesAccessResult {
  success: boolean;
  error?: string;
  userId?: string;
  accessCodeId?: string;
  directiveId?: string;
}

// Function for accessing directives
export const accessDirectives = async (formData: FormData): Promise<DirectivesAccessResult> => {
  console.log("Données du formulaire pour directives:", formData);
  
  try {
    // Make sure formData has required fields
    if (!formData.firstName || !formData.lastName) {
      return {
        success: false,
        error: "Nom et prénom sont requis"
      };
    }

    // Identifier for brute force detection
    const bruteForceIdentifier = `directives_${formData.lastName.substring(0, 3)}_${formData.firstName.substring(0, 3)}`;
    
    // Check if user is not blocked for brute force
    const bruteForceCheck = checkBruteForceAttempt(bruteForceIdentifier);
    
    if (!bruteForceCheck.allowed) {
      showErrorToast("Accès bloqué", "Trop de tentatives. Veuillez réessayer plus tard.");
      return {
        success: false,
        error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(bruteForceCheck.blockExpiresIn! / 60)} minutes.`
      };
    }

    // Check access code
    const accessCodesData = await checkDirectivesAccessCode(formData.accessCode);
    
    if (!accessCodesData || accessCodesData.length === 0) {
      console.log("Code d'accès invalide");
      showErrorToast("Accès refusé", "Code d'accès invalide");
      return { 
        success: false,
        error: "Code d'accès invalide"
      };
    }
    
    // Check personal information
    const userId = accessCodesData[0].user_id;
    // Explicitly pass required values with correct types
    const { isMatch, profile } = await checkProfileMatch(userId, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate
    });
    
    if (!isMatch) {
      console.log("Informations personnelles incorrectes");
      showErrorToast("Accès refusé", "Informations personnelles incorrectes");
      return {
        success: false,
        error: "Informations personnelles incorrectes" 
      };
    }
    
    // Access granted
    console.log("Accès aux directives accordé");
    resetBruteForceCounter(bruteForceIdentifier);
    showSuccessToast("Accès autorisé", "Chargement des directives anticipées...");
    
    // Redirect to directives page after a short delay
    setTimeout(() => {
      window.location.href = '/directives-anticipees';
    }, 1000);
    
    return {
      success: true,
      userId,
      accessCodeId: formData.accessCode,
      directiveId: formData.accessCode // To be replaced with actual directive ID
    };
  } catch (error: any) {
    console.error("Error accessing directives:", error);
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
