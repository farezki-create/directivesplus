
import { supabase } from "@/integrations/supabase/client";
import { AnonymousValidationService } from "./anonymousValidation";
import type { PersonalInfo, AccessValidationResult } from "@/types/accessCode";

/**
 * Service de validation simplifié avec fallback vers Edge Function
 */
export class SimpleValidationService {
  
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    console.log("=== DÉBUT VALIDATION SIMPLIFIÉE (NOUVELLE VERSION) ===");
    console.log("Code d'accès:", accessCode);
    console.log("Infos personnelles:", personalInfo);
    
    try {
      // 1. Essayer d'abord l'Edge Function qui contourne les politiques RLS
      if (personalInfo?.firstName && personalInfo?.lastName) {
        console.log("🚀 Étape 1: Utilisation de l'Edge Function");
        const edgeResult = await AnonymousValidationService.validateCodeAnonymously(
          accessCode, 
          personalInfo
        );
        
        if (edgeResult.success) {
          console.log("✅ Succès via Edge Function");
          return edgeResult;
        }
        
        console.log("❌ Échec Edge Function:", edgeResult.error);
      }

      // 2. Fallback: Vérifier dans shared_documents (peut fonctionner si RLS est moins restrictive)
      console.log("🔍 Étape 2: Fallback shared_documents");
      const sharedResult = await this.checkSharedDocuments(accessCode, personalInfo);
      if (sharedResult.success) {
        console.log("✅ Trouvé dans shared_documents");
        return sharedResult;
      }

      // 3. Essayer la fonction RPC si disponible
      if (personalInfo?.firstName && personalInfo?.lastName) {
        console.log("🔍 Étape 3: Tentative RPC verify_access_identity");
        const rpcResult = await this.checkViaRPC(accessCode, personalInfo);
        if (rpcResult.success) {
          console.log("✅ Trouvé via RPC");
          return rpcResult;
        }
      }
      
      console.log("❌ Toutes les méthodes ont échoué - Problème probable: politiques RLS");
      return {
        success: false,
        error: "Code d'accès invalide ou informations incorrectes. Si le problème persiste, contactez le support technique."
      };
      
    } catch (error: any) {
      console.error("💥 Erreur validation:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }
  
  private static async checkSharedDocuments(
    accessCode: string, 
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    console.log("📋 Recherche dans shared_documents avec code:", accessCode);
    
    try {
      const { data, error } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true);
        
      console.log("📋 Résultat shared_documents:", { data, error });
      
      if (error) {
        console.error("❌ Erreur shared_documents:", error);
        return { success: false, error: error.message };
      }
      
      if (!data || data.length === 0) {
        console.log("📋 Aucun document partagé trouvé");
        return { success: false, error: "Pas de document partagé" };
      }
      
      // Vérifier l'expiration
      const document = data[0];
      if (document.expires_at && new Date(document.expires_at) < new Date()) {
        console.log("⏰ Document expiré:", document.expires_at);
        return { success: false, error: "Code expiré" };
      }
      
      // Si des infos personnelles sont fournies, essayer de vérifier le profil
      if (personalInfo?.firstName && personalInfo?.lastName) {
        console.log("👤 Vérification du profil utilisateur:", document.user_id);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', document.user_id)
          .single();
          
        console.log("👤 Profil trouvé:", { profile, profileError });
        
        if (profile) {
          const firstNameMatch = profile.first_name?.toLowerCase() === personalInfo.firstName.toLowerCase();
          const lastNameMatch = profile.last_name?.toLowerCase() === personalInfo.lastName.toLowerCase();
          const birthDateMatch = !personalInfo.birthDate || profile.birth_date === personalInfo.birthDate;
          
          console.log("🔍 Correspondances:", { firstNameMatch, lastNameMatch, birthDateMatch });
          
          if (!firstNameMatch || !lastNameMatch || !birthDateMatch) {
            return { success: false, error: "Informations personnelles incorrectes" };
          }
        }
      }
      
      // Extraire les documents
      const documentData = document.document_data as any;
      const documents = documentData?.documents || [];
      
      console.log("📄 Documents extraits:", documents.length);
      
      return {
        success: true,
        documents: documents,
        message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`,
        userId: document.user_id,
        accessType: 'shared'
      };
      
    } catch (error: any) {
      console.error("💥 Erreur checkSharedDocuments:", error);
      return { success: false, error: "Erreur technique" };
    }
  }
  
  private static async checkViaRPC(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessValidationResult> {
    console.log("🔧 Tentative RPC verify_access_identity");
    
    try {
      const birthDateString = personalInfo.birthDate ? 
        (typeof personalInfo.birthDate === 'string' ? personalInfo.birthDate : new Date(personalInfo.birthDate).toISOString().split('T')[0]) 
        : null;
        
      console.log("🔧 Paramètres RPC:", {
        input_lastname: personalInfo.lastName,
        input_firstname: personalInfo.firstName,
        input_birthdate: birthDateString,
        input_access_code: accessCode
      });
      
      const { data, error } = await supabase.rpc('verify_access_identity', {
        input_lastname: personalInfo.lastName,
        input_firstname: personalInfo.firstName,
        input_birthdate: birthDateString,
        input_access_code: accessCode,
      });
      
      console.log("🔧 Résultat RPC:", { data, error });
      
      if (error) {
        console.log("⚠️ RPC erreur:", error.message);
        return { success: false, error: "RPC non disponible" };
      }
      
      if (data && data.length > 0) {
        const profile = data[0];
        console.log("✅ RPC succès, profil:", profile);
        
        return {
          success: true,
          message: "Accès autorisé via RPC",
          documents: [],
          userId: profile.user_id || profile.id,
          accessType: 'rpc'
        };
      }
      
      console.log("❌ RPC aucun résultat");
      return { success: false, error: "Aucun résultat RPC" };
      
    } catch (error: any) {
      console.error("💥 Erreur RPC:", error);
      return { success: false, error: "RPC indisponible" };
    }
  }
}
