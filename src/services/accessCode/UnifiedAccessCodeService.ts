import { supabase } from "@/integrations/supabase/client";
import { DocumentRetrievalService } from "./documentRetrieval";
import { CodeGenerationService } from "./codeGeneration";
import type { AccessCodeResult, PersonalInfo, AccessCodeOptions } from "./types";
import type { ShareableDocument } from "@/types/sharing";

/**
 * Service unifié pour la gestion des codes d'accès
 * Centralise toute la logique de validation et génération
 */
export class UnifiedAccessCodeService {
  
  /**
   * Génère un code fixe pour un utilisateur
   */
  static getFixedCode(userId: string): string {
    return CodeGenerationService.generateFixedCode(userId);
  }

  /**
   * Génère un code temporaire et l'enregistre
   */
  static async generateTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      console.log("=== GÉNÉRATION CODE TEMPORAIRE ===");
      console.log("User ID:", userId);
      console.log("Options:", options);

      const expiresInDays = options.expiresInDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Récupérer tous les documents de l'utilisateur
      const documents = await DocumentRetrievalService.getUserDocuments(userId);
      console.log("📄 Documents récupérés pour le code:", documents.length);

      if (documents.length === 0) {
        console.log("⚠️ Aucun document trouvé pour l'utilisateur");
        return {
          success: false,
          error: "Aucun document à partager trouvé"
        };
      }

      // Générer un code d'accès aléatoire
      const accessCode = this.generateRandomCode();
      console.log("🔑 Code généré:", accessCode);

      // Préparer les données pour l'insertion (compatible Json)
      const documentData = {
        access_type: 'global',
        user_id: userId,
        total_documents: documents.length,
        generated_at: new Date().toISOString(),
        documents: documents.map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          created_at: doc.created_at,
          user_id: doc.user_id,
          file_type: doc.file_type,
          source: doc.source,
          content: doc.content,
          description: doc.description,
          content_type: doc.content_type,
          is_private: doc.is_private,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at
        }))
      };

      console.log("💾 Préparation insertion en base...");

      // Insérer dans la table shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          access_code: accessCode,
          user_id: userId,
          document_type: 'global',
          document_id: userId, // Utiliser userId comme document_id pour les accès globaux
          document_data: documentData as any, // Cast explicite pour compatibilité Json
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Erreur insertion:", error);
        return {
          success: false,
          error: `Erreur lors de l'enregistrement: ${error.message}`
        };
      }

      console.log("✅ Code temporaire enregistré avec succès:", data);

      return {
        success: true,
        code: accessCode,
        message: `Code temporaire généré avec succès. Expire le ${expiresAt.toLocaleDateString()}.`
      };

    } catch (error: any) {
      console.error("💥 Erreur génération code temporaire:", error);
      return {
        success: false,
        error: "Erreur technique lors de la génération"
      };
    }
  }

  /**
   * Valide un code d'accès (temporaire ou fixe)
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeResult> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS UNIFIÉ ===");
      console.log("Code:", accessCode);
      console.log("Infos personnelles:", personalInfo);

      // 1. Tentative avec codes temporaires
      const temporaryResult = await this.validateTemporaryCode(accessCode, personalInfo);
      if (temporaryResult.success) {
        console.log("✅ Validation réussie avec code temporaire");
        return temporaryResult;
      }

      // 2. Tentative avec codes fixes (si infos personnelles fournies)
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const fixedResult = await this.validateFixedCode(accessCode, personalInfo);
        if (fixedResult.success) {
          console.log("✅ Validation réussie avec code fixe");
          return fixedResult;
        }
      }

      console.log("❌ Validation échouée pour tous les types de codes");
      return {
        success: false,
        error: "Code d'accès invalide ou expiré"
      };

    } catch (error: any) {
      console.error("💥 Erreur validation:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Valide un code temporaire via RPC
   */
  private static async validateTemporaryCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeResult> {
    try {
      console.log("🔍 Validation code temporaire via RPC");

      const { data, error } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: accessCode,
          input_first_name: personalInfo?.firstName || null,
          input_last_name: personalInfo?.lastName || null,
          input_birth_date: personalInfo?.birthDate || null
        }
      );

      if (error) {
        console.error("❌ Erreur RPC:", error);
        return { success: false, error: "Erreur lors de la vérification" };
      }

      if (!data || data.length === 0) {
        console.log("⚠️ Aucun résultat via RPC");
        return { success: false, error: "Code non trouvé" };
      }

      const result = data[0];
      console.log("📊 Résultat RPC:", result);

      // Typage correct pour accéder aux propriétés de document_data
      if (result.document_data && typeof result.document_data === 'object') {
        const documentData = result.document_data as any;
        if (documentData.documents && Array.isArray(documentData.documents)) {
          return {
            success: true,
            documents: documentData.documents as ShareableDocument[],
            message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`
          };
        }
      }

      return { success: false, error: "Structure de données invalide" };

    } catch (error: any) {
      console.error("💥 Erreur validation code temporaire:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  /**
   * Valide un code fixe
   */
  private static async validateFixedCode(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessCodeResult> {
    try {
      console.log("🔍 Validation code fixe");

      // Rechercher le profil utilisateur
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date')
        .ilike('first_name', personalInfo.firstName)
        .ilike('last_name', personalInfo.lastName);

      if (error) {
        console.error("❌ Erreur recherche profils:", error);
        return { success: false, error: "Erreur lors de la recherche" };
      }

      if (!profiles || profiles.length === 0) {
        console.log("⚠️ Aucun profil trouvé");
        return { success: false, error: "Patient non trouvé" };
      }

      // Vérifier le code fixe pour chaque profil
      for (const profile of profiles) {
        // Vérifier la date de naissance si fournie
        if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
          continue;
        }

        const expectedCode = CodeGenerationService.generateFixedCode(profile.id);
        console.log("🔑 Code attendu:", expectedCode, "Code fourni:", accessCode);

        if (expectedCode === accessCode) {
          console.log("✅ Code fixe validé pour:", profile.id);
          
          // Récupérer les documents
          const documents = await DocumentRetrievalService.getUserDocuments(profile.id);
          
          return {
            success: true,
            documents: documents,
            message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
          };
        }
      }

      return { success: false, error: "Code d'accès invalide" };

    } catch (error: any) {
      console.error("💥 Erreur validation code fixe:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  /**
   * Prolonge un code temporaire
   */
  static async extendCode(accessCode: string, additionalDays: number): Promise<AccessCodeResult> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

      const { data, error } = await supabase
        .from('shared_documents')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .select()
        .single();

      if (error) {
        return { success: false, error: "Code non trouvé ou expiré" };
      }

      return {
        success: true,
        message: `Code prolongé jusqu'au ${newExpiresAt.toLocaleDateString()}`
      };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la prolongation" };
    }
  }

  /**
   * Révoque un code temporaire
   */
  static async revokeCode(accessCode: string): Promise<AccessCodeResult> {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode);

      if (error) {
        return { success: false, error: "Erreur lors de la révocation" };
      }

      return { success: true, message: "Code révoqué avec succès" };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la révocation" };
    }
  }

  /**
   * Génère un code aléatoire
   */
  private static generateRandomCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export type { AccessCodeResult, AccessCodeOptions, PersonalInfo };
