
import { supabase } from "@/integrations/supabase/client";
import { CodeGenerationService } from "./codeGeneration";
import { DocumentRetrievalService } from "./documentRetrieval";
import type { PersonalInfo, AccessValidationResult } from "@/types/accessCode";

/**
 * Service for validating access codes
 */
export class ValidationService {
  /**
   * Valide un code temporaire
   */
  static async validateTemporaryCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Validation code temporaire");

      const { data, error } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        console.log("⚠️ Code temporaire non trouvé ou expiré");
        return { success: false, error: "Code non trouvé ou expiré" };
      }

      // Vérifier les infos personnelles si fournies
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', data.user_id)
          .single();

        if (profile) {
          const firstNameMatch = profile.first_name?.toLowerCase() === personalInfo.firstName.toLowerCase();
          const lastNameMatch = profile.last_name?.toLowerCase() === personalInfo.lastName.toLowerCase();
          const birthDateMatch = !personalInfo.birthDate || profile.birth_date === personalInfo.birthDate;

          if (!firstNameMatch || !lastNameMatch || !birthDateMatch) {
            console.log("❌ Informations personnelles incorrectes");
            return { success: false, error: "Informations personnelles incorrectes" };
          }
        }
      }

      // Extraire les documents du bundle
      const documentData = data.document_data as any;
      if (documentData?.documents && Array.isArray(documentData.documents)) {
        return {
          success: true,
          documents: documentData.documents,
          message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`,
          userId: data.user_id,
          accessType: documentData.accessType || 'global'
        };
      }

      return { success: false, error: "Structure de données invalide" };

    } catch (error: any) {
      console.error("💥 Erreur validation temporaire:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  /**
   * Valide un code fixe
   */
  static async validateFixedCode(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Validation code fixe");
      console.log("Recherche profils avec:", {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        birthDate: personalInfo.birthDate
      });

      // Rechercher avec plusieurs stratégies
      let profiles: any[] = [];

      // Stratégie 1: Recherche exacte
      const { data: exactProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date')
        .eq('first_name', personalInfo.firstName.trim())
        .eq('last_name', personalInfo.lastName.trim());

      if (exactProfiles) profiles = exactProfiles;

      // Stratégie 2: Recherche insensible à la casse si aucun résultat
      if (profiles.length === 0) {
        const { data: caseInsensitiveProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName.trim())
          .ilike('last_name', personalInfo.lastName.trim());

        if (caseInsensitiveProfiles) profiles = caseInsensitiveProfiles;
      }

      console.log("👥 Profils trouvés:", profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        return { 
          success: false, 
          error: "Patient non trouvé" 
        };
      }

      // Vérifier chaque profil
      for (const profile of profiles) {
        console.log("🔍 Vérification profil:", {
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          birth_date: profile.birth_date
        });

        // Vérifier la date de naissance si fournie
        if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
          console.log("❌ Date de naissance ne correspond pas");
          continue;
        }

        // Générer le code fixe attendu pour ce profil
        const expectedCode = CodeGenerationService.generateFixedCode(profile.id);
        console.log("🔑 Code attendu:", expectedCode, "vs fourni:", accessCode);

        if (expectedCode === accessCode) {
          console.log("✅ Code fixe validé pour:", profile.id);
          
          const documents = await DocumentRetrievalService.getUserDocuments(profile.id);
          
          return {
            success: true,
            documents: documents,
            message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`,
            userId: profile.id,
            accessType: 'fixed'
          };
        }
      }

      console.log("❌ Aucun code fixe correspondant trouvé");
      return { 
        success: false, 
        error: "Code d'accès invalide" 
      };

    } catch (error: any) {
      console.error("💥 Erreur validation fixe:", error);
      return { success: false, error: "Erreur technique" };
    }
  }
}
