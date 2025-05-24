
import { supabase } from "@/integrations/supabase/client";
import type { PersonalInfo, AccessValidationResult } from "@/types/accessCode";

/**
 * Service de validation anonyme pour les codes d'accès
 * Utilise des méthodes qui contournent les politiques RLS
 */
export class AnonymousValidationService {
  /**
   * Valide un code d'accès en mode anonyme via Edge Function
   */
  static async validateCodeAnonymously(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Validation anonyme du code:", accessCode);
      
      // Utiliser les constantes directes au lieu des propriétés protégées
      const SUPABASE_URL = "https://kytqqjnecezkxyhmmjrz.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc";
      
      // Utiliser la fonction Edge pour contourner les politiques RLS
      const response = await fetch(`${SUPABASE_URL}/functions/v1/verifierCodeAcces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          accessCode,
          patientName: personalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}` : '',
          patientBirthDate: personalInfo?.birthDate || '',
          bruteForceIdentifier: `institution_access_${personalInfo?.lastName}_${personalInfo?.firstName}`
        })
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        console.error("Erreur Edge Function:", response.status, response.statusText);
        return {
          success: false,
          error: "Erreur technique lors de la validation"
        };
      }

      const result = await response.json();
      console.log("✅ Résultat validation anonyme:", result);

      if (result.success && result.dossier) {
        return {
          success: true,
          message: "Accès autorisé",
          documents: result.dossier.contenu?.documents || [],
          userId: result.dossier.userId,
          accessType: 'anonymous'
        };
      }

      return {
        success: false,
        error: result.error || "Code d'accès invalide"
      };

    } catch (error: any) {
      console.error("💥 Erreur validation anonyme:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Validation rapide par RPC si disponible
   */
  static async validateViaRPC(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Tentative validation RPC");
      
      // Convertir la date en string si elle existe
      const birthDateString = personalInfo.birthDate ? new Date(personalInfo.birthDate).toISOString().split('T')[0] : null;
      
      const { data, error } = await supabase.rpc('verify_access_identity', {
        input_lastname: personalInfo.lastName,
        input_firstname: personalInfo.firstName,
        input_birthdate: birthDateString,
        input_access_code: accessCode,
      });

      if (error) {
        console.log("RPC non disponible:", error.message);
        return { success: false, error: "RPC non disponible" };
      }

      if (data && data.length > 0) {
        const profile = data[0];
        return {
          success: true,
          message: "Accès autorisé via RPC",
          documents: [],
          userId: profile.user_id,
          accessType: 'rpc'
        };
      }

      return { success: false, error: "Aucun résultat RPC" };

    } catch (error) {
      console.log("RPC indisponible");
      return { success: false, error: "RPC indisponible" };
    }
  }
}
