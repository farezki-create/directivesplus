
import { supabase } from "@/integrations/supabase/client";
import type { 
  ShareableDocument, 
  ValidationRequest, 
  ValidationResult,
  GlobalAccessData
} from "@/types/sharing";

/**
 * Interface pour les réponses brutes de Supabase
 */
interface SupabaseRawResponse {
  document_id: string;
  document_type: string;
  document_data: any;
  user_id: string;
  shared_at: string;
}

/**
 * Génère un code fixe basé sur l'ID utilisateur (même logique que dans AccessCodeGenerator)
 */
const generateFixedCode = (userId: string): string => {
  const baseCode = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
  const paddedCode = baseCode.padEnd(8, '0');
  
  return paddedCode
    .replace(/0/g, 'O')
    .replace(/1/g, 'I')
    .replace(/5/g, 'S')
    .substring(0, 8);
};

/**
 * Service de validation des codes d'accès - Version refactorisée
 */
export class ValidationService {
  /**
   * Valide un code d'accès et retourne les documents
   */
  static async validateCode(request: ValidationRequest): Promise<ValidationResult> {
    try {
      console.log("ValidationService.validateCode - Début validation:", {
        accessCode: request.accessCode,
        hasPersonalInfo: !!request.personalInfo
      });

      // D'abord, essayer de valider avec la fonction RPC existante
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: request.accessCode,
          input_first_name: request.personalInfo?.firstName || null,
          input_last_name: request.personalInfo?.lastName || null,
          input_birth_date: request.personalInfo?.birthDate || null
        }
      );

      if (rpcError) {
        console.log("Erreur RPC, tentative avec validation des codes fixes:", rpcError);
      } else if (rpcData && rpcData.length > 0) {
        console.log("Données trouvées via RPC:", rpcData);
        return this.processRpcData(rpcData);
      }

      // Si la RPC n'a pas fonctionné ou n'a pas retourné de données, 
      // essayer la validation avec les codes fixes
      if (request.personalInfo?.firstName && request.personalInfo?.lastName) {
        console.log("Tentative de validation avec codes fixes");
        return await this.validateWithFixedCodes(request);
      }

      console.log("Aucune donnée retournée pour le code:", request.accessCode);
      return {
        success: false,
        error: "Code d'accès invalide ou expiré"
      };

    } catch (error: any) {
      console.error("Erreur ValidationService.validateCode:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Validation avec les codes fixes basés sur l'ID utilisateur
   */
  private static async validateWithFixedCodes(request: ValidationRequest): Promise<ValidationResult> {
    try {
      // Rechercher l'utilisateur par informations personnelles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date')
        .ilike('first_name', request.personalInfo!.firstName!)
        .ilike('last_name', request.personalInfo!.lastName!);

      if (profileError) {
        console.error("Erreur recherche profils:", profileError);
        return {
          success: false,
          error: "Erreur lors de la recherche du profil"
        };
      }

      if (!profiles || profiles.length === 0) {
        console.log("Aucun profil trouvé avec ces informations");
        return {
          success: false,
          error: "Aucun patient trouvé avec ces informations"
        };
      }

      // Vérifier le code fixe pour chaque profil trouvé
      for (const profile of profiles) {
        const expectedCode = generateFixedCode(profile.id);
        console.log("Code attendu pour", profile.first_name, profile.last_name, ":", expectedCode);
        
        if (expectedCode === request.accessCode) {
          console.log("Code fixe validé pour l'utilisateur:", profile.id);
          
          // Récupérer tous les documents de l'utilisateur
          const documents = await this.fetchUserDocuments(profile.id);
          
          return {
            success: true,
            documents: documents,
            message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
          };
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide pour ce patient"
      };

    } catch (error: any) {
      console.error("Erreur validation codes fixes:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Récupère tous les documents d'un utilisateur
   */
  private static async fetchUserDocuments(userId: string): Promise<ShareableDocument[]> {
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

    console.log(`${documents.length} documents récupérés pour l'utilisateur ${userId}`);
    return documents;
  }

  /**
   * Traite les données retournées par la RPC
   */
  private static processRpcData(data: any[]): ValidationResult {
    const responseData = data[0] as SupabaseRawResponse;
    
    if (!responseData.document_data) {
      console.error("Aucune donnée de document trouvée");
      return {
        success: false,
        error: "Structure de données invalide"
      };
    }

    const globalData = responseData.document_data as GlobalAccessData;
    
    if (!globalData || typeof globalData !== 'object') {
      console.error("Format de données invalide:", globalData);
      return {
        success: false,
        error: "Format de données invalide"
      };
    }

    if (globalData.access_type !== 'global' || !Array.isArray(globalData.documents)) {
      console.error("Structure de données globales invalide:", globalData);
      return {
        success: false,
        error: "Format de données invalide"
      };
    }

    console.log(`Documents extraits: ${globalData.documents.length} documents trouvés`);
    
    return {
      success: true,
      documents: globalData.documents,
      message: `Accès autorisé. ${globalData.documents.length} document(s) trouvé(s).`
    };
  }
}
