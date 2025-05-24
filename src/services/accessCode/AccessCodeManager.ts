
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/sharing";

/**
 * Types pour le gestionnaire unifié de codes d'accès
 */
export interface AccessCodeOptions {
  expiresInDays?: number;
  requirePersonalInfo?: boolean;
}

export interface AccessCodeValidation {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

/**
 * Structure pour les données stockées dans Supabase (compatible avec Json)
 */
interface TemporaryAccessData {
  access_type: string;
  user_id: string;
  total_documents: number;
  generated_at: string;
  documents: any[]; // Utilisation d'any[] pour la compatibilité Json
  [key: string]: any; // Index signature pour la compatibilité
}

/**
 * Gestionnaire unifié pour tous les codes d'accès
 * - Codes fixes basés sur l'ID utilisateur (permanents)
 * - Codes temporaires pour partage
 * - Un seul point d'entrée pour toute la gestion
 */
export class AccessCodeManager {
  /**
   * Génère un code fixe basé sur l'ID utilisateur (toujours le même)
   */
  private static generateFixedCode(userId: string): string {
    const baseCode = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
    const paddedCode = baseCode.padEnd(8, '0');
    
    return paddedCode
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S')
      .substring(0, 8);
  }

  /**
   * Récupère tous les documents d'un utilisateur
   */
  private static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    const documents: ShareableDocument[] = [];

    // Récupérer les directives
    const { data: directives } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', userId);

    if (directives) {
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

    // Récupérer les documents PDF
    const { data: pdfDocs } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('user_id', userId);

    if (pdfDocs) {
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

    // Récupérer les documents médicaux
    const { data: medicalDocs } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId);

    if (medicalDocs) {
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

    return documents;
  }

  /**
   * MÉTHODE PRINCIPALE : Obtenir le code d'accès d'un utilisateur
   * Retourne toujours le même code fixe pour un utilisateur donné
   */
  static getFixedAccessCode(userId: string): string {
    return this.generateFixedCode(userId);
  }

  /**
   * MÉTHODE PRINCIPALE : Générer un code temporaire de partage
   * Crée un code temporaire avec expiration pour partager des documents
   */
  static async generateTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<{ success: boolean; code?: string; error?: string }> {
    try {
      const { expiresInDays = 30 } = options;
      
      // Récupérer tous les documents de l'utilisateur
      const documents = await this.getUserDocuments(userId);
      
      if (documents.length === 0) {
        return {
          success: false,
          error: "Aucun document trouvé pour générer un code de partage"
        };
      }

      // Créer la structure de données compatible avec Json
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

      // Créer l'entrée dans shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: userId,
          document_type: 'temporary_access',
          document_data: shareData as any, // Cast vers any pour la compatibilité
          user_id: userId,
          expires_at: expiresAt.toISOString()
        })
        .select('access_code')
        .single();

      if (error) {
        return { 
          success: false, 
          error: `Erreur lors de la génération: ${error.message}` 
        };
      }

      return { 
        success: true, 
        code: data.access_code 
      };

    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }

  /**
   * MÉTHODE PRINCIPALE : Valider un code d'accès (fixe ou temporaire)
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS UNIFIÉ ===");
      console.log("Code:", accessCode);
      console.log("Infos personnelles:", !!personalInfo);

      // 1. D'abord essayer avec les codes temporaires via RPC
      if (personalInfo) {
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
          
          // Vérification du type et accès sécurisé aux propriétés
          if (responseData.document_data && typeof responseData.document_data === 'object') {
            const documentData = responseData.document_data as any;
            if (documentData.documents && Array.isArray(documentData.documents)) {
              return {
                success: true,
                documents: documentData.documents as ShareableDocument[],
                message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      // 2. Ensuite essayer avec les codes fixes
      if (personalInfo) {
        console.log("Tentative avec codes fixes");
        
        // Rechercher le profil utilisateur
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName)
          .ilike('last_name', personalInfo.lastName);

        if (!profileError && profiles && profiles.length > 0) {
          for (const profile of profiles) {
            // Vérifier si la date de naissance correspond (si fournie)
            if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
              continue;
            }

            const expectedCode = this.generateFixedCode(profile.id);
            console.log("Code attendu pour", profile.first_name, profile.last_name, ":", expectedCode);
            
            if (expectedCode === accessCode) {
              console.log("Code fixe validé pour l'utilisateur:", profile.id);
              
              const documents = await this.getUserDocuments(profile.id);
              
              return {
                success: true,
                documents: documents,
                message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide ou informations incorrectes"
      };

    } catch (error: any) {
      console.error("Erreur validation code:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * MÉTHODE PRINCIPALE : Prolonger un code temporaire
   */
  static async extendTemporaryCode(
    accessCode: string, 
    additionalDays: number = 30
  ): Promise<{ success: boolean; error?: string }> {
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

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }

  /**
   * MÉTHODE PRINCIPALE : Révoquer un code temporaire
   */
  static async revokeTemporaryCode(accessCode: string): Promise<{ success: boolean; error?: string }> {
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

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }
}
