
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/sharing";
import CryptoJS from 'crypto-js';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface AccessCodeOptions {
  expiresInDays?: number;
  accessType?: 'global' | 'institution' | 'personal';
}

export interface AccessCodeValidation {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}

export interface AccessCodeResult extends AccessCodeValidation {
  code?: string;
}

/**
 * Service unifié et simplifié pour la gestion des codes d'accès
 * Remplace tous les autres services liés aux codes d'accès
 */
export class AccessCodeManager {
  
  /**
   * Génère un code fixe reproductible basé sur l'ID utilisateur
   */
  static getFixedAccessCode(userId: string): string {
    const hash = CryptoJS.SHA256(userId).toString();
    let code = hash.substring(0, 8).toUpperCase();
    
    // Remplacement pour éviter confusion
    return code
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S');
  }

  /**
   * Génère un code temporaire et l'enregistre en base
   */
  static async generateTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      console.log("=== GÉNÉRATION CODE TEMPORAIRE ===");
      console.log("User ID:", userId, "Options:", options);

      const expiresInDays = options.expiresInDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Récupérer tous les documents utilisateur
      const documents = await this.getUserDocuments(userId);
      console.log("📄 Documents récupérés:", documents.length);

      if (documents.length === 0) {
        return {
          success: false,
          error: "Aucun document à partager trouvé"
        };
      }

      // Générer code unique
      const accessCode = this.generateUniqueCode();
      console.log("🔑 Code généré:", accessCode);

      // Préparer les données pour l'insertion
      const documentData = {
        access_type: options.accessType || 'global',
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
          content: doc.content || null,
          description: doc.description || null,
          content_type: doc.content_type || null,
          is_private: doc.is_private || false,
          external_id: doc.external_id || null,
          file_size: doc.file_size || null,
          updated_at: doc.updated_at || null
        }))
      };

      // Insérer en base
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          access_code: accessCode,
          user_id: userId,
          document_type: 'global',
          document_id: userId,
          document_data: documentData as any,
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

      console.log("✅ Code enregistré avec succès");
      return {
        success: true,
        code: accessCode,
        message: `Code temporaire généré. Expire le ${expiresAt.toLocaleDateString()}.`
      };

    } catch (error: any) {
      console.error("💥 Erreur génération:", error);
      return {
        success: false,
        error: "Erreur technique lors de la génération"
      };
    }
  }

  /**
   * Valide un code d'accès (temporaire ou fixe)
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS ===");
      console.log("Code:", accessCode, "Infos:", personalInfo);

      // 1. Tentative codes temporaires via RPC
      const temporaryResult = await this.validateTemporaryCode(accessCode, personalInfo);
      if (temporaryResult.success) {
        console.log("✅ Code temporaire validé");
        return temporaryResult;
      }

      // 2. Tentative codes fixes
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const fixedResult = await this.validateFixedCode(accessCode, personalInfo);
        if (fixedResult.success) {
          console.log("✅ Code fixe validé");
          return fixedResult;
        }
      }

      console.log("❌ Validation échouée");
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
   * Prolonge un code temporaire
   */
  static async extendTemporaryCode(accessCode: string, additionalDays: number): Promise<AccessCodeResult> {
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
  static async revokeTemporaryCode(accessCode: string): Promise<AccessCodeResult> {
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

  // === MÉTHODES PRIVÉES ===

  private static async validateTemporaryCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> {
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
        console.log("⚠️ Aucun résultat RPC");
        return { success: false, error: "Code non trouvé" };
      }

      const result = data[0];
      console.log("📊 Résultat RPC:", result);

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
      console.error("💥 Erreur validation temporaire:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  private static async validateFixedCode(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessCodeValidation> {
    try {
      console.log("🔍 Validation code fixe");

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

      for (const profile of profiles) {
        if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
          continue;
        }

        const expectedCode = this.getFixedAccessCode(profile.id);
        console.log("🔑 Code attendu:", expectedCode, "fourni:", accessCode);

        if (expectedCode === accessCode) {
          console.log("✅ Code fixe validé pour:", profile.id);
          
          const documents = await this.getUserDocuments(profile.id);
          
          return {
            success: true,
            documents: documents,
            message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
          };
        }
      }

      return { success: false, error: "Code d'accès invalide" };

    } catch (error: any) {
      console.error("💥 Erreur validation fixe:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  private static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    console.log("📄 Récupération documents pour:", userId);
    
    const documents: ShareableDocument[] = [];

    try {
      // Directives
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId);

      if (!directivesError && directives) {
        directives.forEach(directive => {
          documents.push({
            id: directive.id,
            file_name: `Directive - ${new Date(directive.created_at).toLocaleDateString()}`,
            file_path: `directive-${directive.id}`,
            created_at: directive.created_at,
            user_id: directive.user_id,
            file_type: 'directive',
            source: 'directives',
            content: directive.content,
            description: 'Directive anticipée',
            content_type: 'application/json'
          });
        });
      }

      // Documents PDF
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      if (!pdfError && pdfDocs) {
        pdfDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'pdf',
            source: 'pdf_documents',
            description: doc.description || 'Document PDF',
            content_type: doc.content_type || 'application/pdf',
            external_id: doc.external_id,
            file_size: doc.file_size,
            updated_at: doc.updated_at
          });
        });
      }

      // Documents médicaux
      const { data: medicalDocs, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      if (!medicalError && medicalDocs) {
        medicalDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'medical',
            source: 'medical_documents',
            description: doc.description || 'Document médical',
            content_type: doc.file_type || 'application/pdf',
            file_size: doc.file_size
          });
        });
      }

      console.log("✅ Total documents récupérés:", documents.length);
      return documents;

    } catch (error) {
      console.error("💥 Erreur récupération documents:", error);
      return [];
    }
  }

  private static generateUniqueCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
