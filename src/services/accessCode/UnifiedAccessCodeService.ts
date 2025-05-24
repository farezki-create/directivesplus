
import { supabase } from "@/integrations/supabase/client";
import { DocumentRetrievalService } from "./documentRetrieval";
import { CodeGenerationService } from "./codeGeneration";
import type { AccessCodeOptions, PersonalInfo, TemporaryAccessData } from "./types";
import type { ShareableDocument } from "@/types/sharing";

export interface AccessCodeResult {
  success: boolean;
  code?: string;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}

/**
 * Service unifié pour tous les codes d'accès
 * Centralise toute la logique de génération, validation et gestion
 */
export class UnifiedAccessCodeService {
  /**
   * Génère un code d'accès fixe (permanent) pour un utilisateur
   */
  static getFixedCode(userId: string): string {
    console.log("🔧 Génération code fixe pour:", userId);
    const code = CodeGenerationService.generateFixedCode(userId);
    console.log("✅ Code fixe généré:", code);
    return code;
  }

  /**
   * Génère un code temporaire pour partager tous les documents d'un utilisateur
   */
  static async generateTemporaryCode(
    userId: string,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      console.log("🔄 Début génération code temporaire pour userId:", userId);
      console.log("📋 Options:", options);
      
      const { expiresInDays = 30 } = options;
      
      // Récupérer tous les documents de l'utilisateur
      const documents = await DocumentRetrievalService.getUserDocuments(userId);
      console.log("📄 Documents récupérés:", documents.length);
      
      if (documents.length === 0) {
        console.warn("⚠️ Aucun document trouvé pour l'utilisateur:", userId);
        return {
          success: false,
          error: "Aucun document trouvé pour générer un code de partage"
        };
      }

      // Créer la structure de données pour le partage
      const shareData: TemporaryAccessData = {
        access_type: 'temporary',
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
          description: doc.description || '',
          content_type: doc.content_type || '',
          content: doc.content,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at,
          is_private: doc.is_private
        }))
      };

      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      console.log("💾 Insertion dans shared_documents...");
      
      // Créer l'entrée dans shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: userId,
          document_type: 'temporary_access',
          document_data: shareData as any,
          user_id: userId,
          expires_at: expiresAt.toISOString()
        })
        .select('access_code, id, shared_at')
        .single();

      if (error) {
        console.error("❌ Erreur insertion:", error);
        return { 
          success: false, 
          error: `Erreur lors de la génération: ${error.message}` 
        };
      }

      if (!data?.access_code) {
        console.error("❌ Aucun code d'accès généré");
        return {
          success: false,
          error: "Erreur: aucun code d'accès généré"
        };
      }

      console.log("✅ Code temporaire généré:", data.access_code);
      console.log("📋 ID enregistrement:", data.id);
      console.log("🕐 Date de partage:", data.shared_at);

      // Vérification supplémentaire
      const verification = await this.verifyCodeExists(data.access_code);
      if (!verification.success) {
        console.error("❌ Vérification échouée:", verification.error);
        return {
          success: false,
          error: "Erreur: impossible de vérifier l'enregistrement"
        };
      }

      console.log("🎉 Génération code temporaire terminée avec succès");
      
      return { 
        success: true, 
        code: data.access_code,
        message: `Code temporaire créé avec succès. ${documents.length} document(s) partagé(s).`
      };

    } catch (error: any) {
      console.error("💥 Erreur technique génération:", error);
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }

  /**
   * Valide un code d'accès (fixe ou temporaire)
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeResult> {
    try {
      console.log("🔍 Validation code d'accès:", accessCode);
      console.log("👤 Infos personnelles fournies:", !!personalInfo);

      // 1. Essayer d'abord avec les codes temporaires
      if (personalInfo) {
        console.log("🔄 Test codes temporaires avec RPC...");
        
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'get_shared_documents_by_access_code',
          {
            input_access_code: accessCode,
            input_first_name: personalInfo.firstName,
            input_last_name: personalInfo.lastName,
            input_birth_date: personalInfo.birthDate
          }
        );

        if (!rpcError && rpcData && rpcData.length > 0) {
          const responseData = rpcData[0];
          
          if (responseData.document_data && typeof responseData.document_data === 'object') {
            const documentData = responseData.document_data as any;
            if (documentData.documents && Array.isArray(documentData.documents)) {
              console.log("✅ Code temporaire validé:", documentData.documents.length, "document(s)");
              return {
                success: true,
                documents: documentData.documents as ShareableDocument[],
                message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      // 2. Essayer avec les codes fixes
      if (personalInfo) {
        console.log("🔄 Test codes fixes...");
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName)
          .ilike('last_name', personalInfo.lastName);

        if (!profileError && profiles && profiles.length > 0) {
          for (const profile of profiles) {
            if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
              continue;
            }

            const expectedCode = CodeGenerationService.generateFixedCode(profile.id);
            console.log("🔍 Code attendu pour", profile.first_name, profile.last_name, ":", expectedCode);
            
            if (expectedCode === accessCode) {
              console.log("✅ Code fixe validé pour:", profile.id);
              
              const documents = await DocumentRetrievalService.getUserDocuments(profile.id);
              
              return {
                success: true,
                documents: documents,
                message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      console.log("❌ Validation échouée");
      return {
        success: false,
        error: "Code d'accès invalide ou informations incorrectes"
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
   * Vérifie qu'un code existe bien en base
   */
  private static async verifyCodeExists(accessCode: string): Promise<AccessCodeResult> {
    try {
      const { data, error } = await supabase
        .from('shared_documents')
        .select('id, access_code, is_active, expires_at')
        .eq('access_code', accessCode)
        .single();

      if (error || !data) {
        return {
          success: false,
          error: "Code non trouvé en base de données"
        };
      }

      console.log("✅ Code vérifié en base:", {
        id: data.id,
        access_code: data.access_code,
        is_active: data.is_active,
        expires_at: data.expires_at
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Prolonge un code temporaire
   */
  static async extendCode(
    accessCode: string,
    additionalDays: number = 30
  ): Promise<AccessCodeResult> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

      const { error } = await supabase
        .from('shared_documents')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('access_code', accessCode)
        .eq('is_active', true);

      if (error) {
        return { 
          success: false, 
          error: `Erreur lors de la prolongation: ${error.message}` 
        };
      }

      return { 
        success: true,
        message: `Code prolongé de ${additionalDays} jours`
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
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
        return { 
          success: false, 
          error: `Erreur lors de la révocation: ${error.message}` 
        };
      }

      return { 
        success: true,
        message: "Code révoqué avec succès"
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }
}
